//! Эндпоинты восстановления пароля
//! 
use chrono::{Utc, Duration};
use actix_web::{post, web};
use serde::{Deserialize, Serialize};
use sha256::digest;
use std::fmt::Debug;
use crate::utils::api_responce::{self, ApiResponse};
use crate::utils::email_exa::*;
use crate::utils::endpoints_limit::limitation_generate_code;
use crate::utils::jwt::{encode_jwt};
use crate::utils::{app_state};

use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, EntityTrait, QueryFilter, Set};

#[derive(Debug, Serialize, Deserialize)]
struct PasswordResetRequest{
    email:String,
}

#[derive(Debug, Serialize, Deserialize)]
struct TokenAndPass {
    token: String,
    pass: String
}

#[post("/password_reset_request")] 
async fn send_email_internal(email_json: web::Json<PasswordResetRequest>,
app_state: web::Data<app_state::AppState>,
) -> Result<ApiResponse, ApiResponse> {
 use crate::utils::mailer::YandexSmtpClient;


        // Проверяем email на пустоту
    if !null_email(&email_json.email) {
        return Err(ApiResponse::new(404, "Пустой Email".to_string()));
    }


    let user_exists = UserRepository::user_exists_by_email_in_logis(
            &app_state.db,  
            &email_json.email 
        ).await
        .map_err(|err| ApiResponse::new(500, format!("Ошибка базы данных: {}", err)))?;
   

    // Если мыла нет в системе
    if !user_exists {
        return Err(ApiResponse::new(401, "Не существующий Email".to_string()));
    }


    // Когда код дергал ты??
    let time_examin = limitation_generate_code(&app_state.db, &email_json.email).await;
    if !time_examin {
        return Err(ApiResponse::new(410, "Истекло время кода".to_string()));
    }

      // Получаем пользователя
    let user = entity::logins::Entity::find()
        .filter(entity::logins::Column::Email.eq(&email_json.email))
        .one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?
        .ok_or(ApiResponse::new(404, "Пользователь не найден".to_owned()))?;

    // Генерируем токен для сброса (отдельный от auth токена)
    let token = encode_jwt(user.email.clone(), user.id as i32)
        .map_err(|err| ApiResponse::new(500, err.to_string()))?;

    // Создаем или обновляем запись сброса пароля
    let existing = entity::password_resets::Entity::find()
        .filter(entity::password_resets::Column::Email.eq(&email_json.email))
        .one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?;

    match existing {
        Some(record) => {
            let mut active_model: entity::password_resets::ActiveModel = record.into();
            active_model.token = Set(Some(token.clone()));
            active_model.create_date = Set(Utc::now().naive_utc());
            active_model.expires_date = Set(Utc::now().naive_utc() + Duration::minutes(5));
            active_model.is_used = Set(false);
            
            active_model.update(&app_state.db).await
                .map_err(|err| ApiResponse::new(500, err.to_string()))?;
        }
        None => {
            entity::password_resets::ActiveModel {
                email: Set(email_json.email.clone()),
                token: Set(Some(token.clone())),
                create_date: Set(Utc::now().naive_utc()),
                expires_date: Set(Utc::now().naive_utc() + Duration::minutes(5)),
                is_used: Set(false),
                code: Set(12345),//Заглушка
                user_id: Set(1),//Заглушка
                ..Default::default()
            }.insert(&app_state.db).await
            .map_err(|err| ApiResponse::new(500, err.to_string()))?;
        }
    }


    let config = crate::utils::mailer::YandexSmtpConfig::default();
    let client = YandexSmtpClient::new(config).await
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;
    client.send_email(&email_json.email, token.clone()).await
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;


    Ok(api_responce::ApiResponse::new(200, format!("Письмо отправлено")))
}



#[post("/pass_resset")]
async fn pass_resset(app_state: web::Data<app_state::AppState>, token_and_pass: web::Json<TokenAndPass>) 
-> Result<ApiResponse,ApiResponse> {

    //Проверка существования токена
    let user_token = entity::password_resets::Entity::find()
    .filter(
        Condition::all()
        .add(entity::password_resets::Column::Token.eq(&token_and_pass.token))
    )
    .one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?
     .ok_or(ApiResponse::new(404, "Токена не существует".to_owned()))?;


    //Проверка что токен не протух
    let now = Utc::now().naive_utc();
    println!("{}", now);
    let _token_data = entity::password_resets::Entity::find()
    .filter(
        Condition::all()
        .add(entity::password_resets::Column::Token.eq(&token_and_pass.token))
        .add(entity::password_resets::Column::ExpiresDate.gt(now)) // значит что ExpiresDate > now
    )
    .one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?
     .ok_or(ApiResponse::new(410, "Токен протух".to_owned()))?;

    //Проверка использованного токена
    let token_flag = entity::password_resets::Entity::find()
    .filter(
        Condition::all()
        .add(entity::password_resets::Column::Token.eq(&token_and_pass.token))
        .add(entity::password_resets::Column::IsUsed.eq(false))
    )
    .one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?
     .ok_or(ApiResponse::new(411, "Токен использовался".to_owned()))?;
    

    let user_logins = entity::logins::Entity::find()
    .filter(
        Condition::all()
        .add(entity::logins::Column::Email.eq(&user_token.email))
    ).one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?
     .ok_or(ApiResponse::new(404, "Не нашли Email".to_owned()))?;

    //Cоздание токена
    let token = encode_jwt(user_logins.email.clone(), user_logins.id as i32)
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;
    //Хеш пароля
    let hashed_password = digest(&token_and_pass.pass);
    //Запись токена и пароля
    let mut user_logins_active: entity::logins::ActiveModel = user_logins.into();
    user_logins_active.pass = Set(hashed_password);
    user_logins_active.token = Set(Some(token.clone()));
    user_logins_active.update(&app_state.db).await
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;



    let mut user_flag: entity::password_resets::ActiveModel = token_flag.into();
    // Устанавливаем флаг
    user_flag.is_used = sea_orm::ActiveValue::Set(true);
    // Обновляем запись в базе данных
    user_flag.update(&app_state.db)
        .await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?;

    Ok(api_responce::ApiResponse::new(200, format!("{{\"token\": \"{}\"}}", token)))
}

