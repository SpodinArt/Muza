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
struct Pass_Examination_Code {
    email: String,
    code: i32,
}

#[derive(Debug, Serialize, Deserialize)]
struct Token_And_Pass {
    email: String,
    token: String,
    pass: String
}

#[post("/password_reset_request")] 
async fn send_email_internal(email_json: web::Json<PasswordResetRequest>,
app_state: web::Data<app_state::AppState>,
) -> Result<ApiResponse, ApiResponse> {
 use crate::utils::mailer::YandexSmtpClient;

    let code = generate_code();
    let time_examin = limitation_generate_code(&app_state.db, &email_json.email).await;


    // Когда код дергал ты??
    if !time_examin {
        return Err(ApiResponse::new(410, "Истекло время кода".to_string()));
    }

    // Проверяем email на пустоту
    if !null_email(&email_json.email) {
        return Err(ApiResponse::new(400, "Пустой Email".to_string()));
    }


    let user_exists = UserRepository::user_exists_by_email_in_logis(
            &app_state.db,  
            &email_json.email 
        ).await
        .map_err(|err| format!("Ошибка базы данных: {}", err));
   

        // Если мыла нет в системе
        if user_exists == Ok(false) {
    return Err(ApiResponse::new(404, "Не существующий Email".to_string()));
        }


// Проверяем, есть ли уже запись для этого email
let existing = entity::password_resets::Entity::find()
    .filter(entity::password_resets::Column::Email.eq(&email_json.email))
    .one(&app_state.db).await
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;


match existing {
    Some(mut _record) => {
        // Обновляем существующую запись
        let mut active_model: entity::password_resets::ActiveModel = _record.into();
        active_model.code = Set(code.clone());
        active_model.create_date = Set(Utc::now().naive_utc());
        active_model.expires_date = Set(Utc::now().naive_utc() + Duration::minutes(5));
        active_model.is_used = Set(false);
        active_model.update(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?;
    }
    None => {
        // Создаем новую запись
        entity::password_resets::ActiveModel {
            email: Set(email_json.email.clone()),
            code: Set(code.clone()),
            create_date: Set(Utc::now().naive_utc()),
            expires_date: Set(Utc::now().naive_utc() + Duration::minutes(5)),
            is_used: Set(false),
            user_id: Set(1),// Дропнуть после исправления БД
            ..Default::default()
        }.insert(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?;
    }
}


    let config = crate::utils::mailer::YandexSmtpConfig::default();
    let client = YandexSmtpClient::new(config).await
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;
    client.send_email(&email_json.email, code).await
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;


    Ok(api_responce::ApiResponse::new(200, format!("Введите код")))
}




#[post("/pass_examination_code")]
async fn pass_examination_code(app_state: web::Data<app_state::AppState>, email_code: web::Json<Pass_Examination_Code>) 
-> Result<ApiResponse,ApiResponse> {

    let now = Utc::now().naive_utc();

    let user_data = entity::password_resets::Entity::find()
        .filter(
            Condition::all()
            .add(entity::password_resets::Column::Email.eq(&email_code.email))
            .add(entity::password_resets::Column::Code.eq(email_code.code.clone()))
            .add(entity::password_resets::Column::IsUsed.eq(false))
            .add(entity::password_resets::Column::ExpiresDate.gt(now))
        )
        .one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?
     .ok_or(ApiResponse::new(401, "Неверный код подтверждения или время его действия истекло".to_owned()))?;


    let token = encode_jwt(user_data.email.clone(), user_data.id as i32)
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;


    let mut user_data_active: entity::password_resets::ActiveModel = user_data.into();
    // Устанавливаем токен
    user_data_active.token = sea_orm::ActiveValue::Set(Some(token.clone()));
    // Обновляем запись в базе данных
    user_data_active.update(&app_state.db)
        .await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?;


    Ok(api_responce::ApiResponse::new(200, format!("{{\"token\": \"{}\"}}", token)))
}


#[post("/pass_resset")]
async fn pass_resset(app_state: web::Data<app_state::AppState>, token_and_pass: web::Json<Token_And_Pass>) 
-> Result<ApiResponse,ApiResponse> {


    let user_ress = entity::password_resets::Entity::find()
    .filter(
        Condition::all()
        .add(entity::password_resets::Column::Email.eq(&token_and_pass.email))
        .add(entity::password_resets::Column::Token.eq(&token_and_pass.token))
        .add(entity::password_resets::Column::IsUsed.eq(false))
    )
    .one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?
     .ok_or(ApiResponse::new(409, "Код уже использован".to_owned()))?;


    let user_logins = entity::logins::Entity::find()
    .filter(
        Condition::all()
        .add(entity::logins::Column::Email.eq(&user_ress.email))
    ).one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?
     .ok_or(ApiResponse::new(404, "Не нашли Email".to_owned()))?;


    let token = encode_jwt(user_logins.email.clone(), user_logins.id as i32)
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;


    let mut user_logins_active: entity::logins::ActiveModel = user_logins.into();
    let hashed_password = digest(&token_and_pass.pass);
    user_logins_active.pass = Set(hashed_password);


    user_logins_active.update(&app_state.db).await
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;



    let mut user_flag: entity::password_resets::ActiveModel = user_ress.into();
    // Устанавливаем флаг
    user_flag.is_used = sea_orm::ActiveValue::Set(true);
    // Обновляем запись в базе данных
    user_flag.update(&app_state.db)
        .await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?;

    Ok(api_responce::ApiResponse::new(200, format!("{{\"token\": \"{}\"}}", token)))
}

