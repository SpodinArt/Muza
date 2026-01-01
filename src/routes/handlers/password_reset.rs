//! Эндпоинты восстановления пароля
//! 
use chrono::{Utc, Duration};
use actix_web::{post, web};
use serde::{Deserialize, Serialize};
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
struct Pass_examination_code {
    email: String,
    code: i32,
}


#[post("/password_reset_request")] 
async fn send_email_internal(email_json: web::Json<PasswordResetRequest>,
app_state: web::Data<app_state::AppState>,
) -> Result<(), Box<dyn std::error::Error>> {
 use crate::utils::mailer::YandexSmtpClient;

    let code = generate_code();
    let time_examin = limitation_generate_code(&app_state.db, &email_json.email);

    // Когда код дергал ты??
    if !time_examin.await {
        return Err("За писюн себя подергай".into());
    }

    // Проверяем email на пустоту
    if !null_email(&email_json.email) {
        return Err("Поле email не может быть пустым".into());
    }

    let user_exists = UserRepository::user_exists_by_email_in_logis(
            &app_state.db,  
            &email_json.email 
        ).await
        .map_err(|err| format!("Ошибка базы данных: {}", err))?;
   

        // Если мыла нет в системе
        if !user_exists {
    println!("⚠️ Запрос сброса пароля для несуществующего email: {}", email_json.email);
    return Ok(());
        }


// Проверяем, есть ли уже запись для этого email
let existing = entity::password_resets::Entity::find()
    .filter(entity::password_resets::Column::Email.eq(&email_json.email))
    .filter(entity::password_resets::Column::IsUsed.eq(false))
    .one(&app_state.db).await?;

match existing {
    Some(mut _record) => {
       
        // Обновляем существующую запись
        let mut active_model: entity::password_resets::ActiveModel = _record.into();
        active_model.code = Set(code.clone());
        active_model.create_date = Set(Utc::now().naive_utc());
        active_model.expires_date = Set(Utc::now().naive_utc() + Duration::minutes(15));
        active_model.is_used = Set(false);
        active_model.is_used = Set(false);

        active_model.update(&app_state.db).await?;
    }
    None => {
        // Создаем новую запись
        entity::password_resets::ActiveModel {
            email: Set(email_json.email.clone()),
            code: Set(code.clone()),
            create_date: Set(Utc::now().naive_utc()),
            expires_date: Set(Utc::now().naive_utc() + Duration::minutes(15)),
            is_used: Set(false),
            ..Default::default()
        }.insert(&app_state.db).await?;
    }
}
    let config = crate::utils::mailer::YandexSmtpConfig::default();
    let client = YandexSmtpClient::new(config).await?;
    client.send_email(&email_json.email, code).await?;
    Ok(())

    
}

#[post("/pass_examination_code")]
async fn pass_examination_code(app_state: web::Data<app_state::AppState>, email_code: web::Json<Pass_examination_code>) -> Result<ApiResponse,ApiResponse> {
    let user_data = entity::password_resets::Entity::find()
        .filter(
            Condition::all()
            .add(entity::password_resets::Column::Email.eq(&email_code.email))
            .add(entity::password_resets::Column::Code.eq(email_code.code.clone()))
            .add(entity::password_resets::Column::IsUsed.eq(false))
        )
        .one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?
     .ok_or(ApiResponse::new(404, "Код потерял парень?".to_owned()))?;

    let token = encode_jwt(user_data.email, user_data.id as i32)
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;

    let user_token = entity::password_resets::Entity::find()
    .filter(Condition::all()
    //.add(entity::password_resets::Column::Token(token.clone())) раскоментить когда будет готов токен в БД
    ).one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?;

    Ok(api_responce::ApiResponse::new(200, format!("{{\"token\": \"{}\"}}", token)))
}
