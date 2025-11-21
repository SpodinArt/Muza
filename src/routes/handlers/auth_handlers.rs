//!
//! В этом модуле хранятся api для создания пользователя в системе: register и его структура RegisterModel
//! 
//! Эндпоинт входа login и его структура: LoginModel
//! 
//! А так же пока не реализованные эндпоинты отправки на мыло кода и смены пароля.
//!
use rand::Rng;
use chrono::Utc;
use sha256::digest;
use actix_web::{post, web, Responder};
use serde::Deserialize;
use serde::Serialize;
use crate::utils::api_responce::ApiResponse;
use crate::utils::jwt::encode_jwt;
use crate::utils::mailer::smtp_full_server;
use crate::utils::{api_responce, app_state};
use sea_orm::{ActiveModelTrait, Condition, ColumnTrait, EntityTrait, QueryFilter, Set};
use crate::repositories::user_repository::UserRepository;

#[derive(Debug, Serialize, Deserialize)]
struct RegisterModel {
    login: String,
    email: String,
    password: String,
    phone_number: i64,
}
#[derive(Debug,Serialize, Deserialize)]
struct LoginModel{
    email: String,
    password: String
}

#[derive(Debug, Serialize, Deserialize)]
struct PasswordResetRequest{
    email:String,
}

#[post("/register")]
pub async fn register(
    app_state: web::Data<app_state::AppState>,
    register_json: web::Json<RegisterModel>
) -> Result<ApiResponse, ApiResponse> {  

    
    // Проверка существования email
    if UserRepository::user_exists_by_email(&app_state.db, &register_json.email).await.unwrap_or(false) {
        return Err(ApiResponse::new(409, "Мыло уже существует чувак".to_string()));
    }
    
    // Проверка существования login
    if UserRepository::user_exists_by_login(&app_state.db, &register_json.login).await.unwrap_or(false) {
        return Err(ApiResponse::new(409, "Твой логин уже поюзали".to_string()));
    }
    
    // Остальной код регистрации...
    let hashed_password = digest(&register_json.password);
    
    let user_model = entity::logins::ActiveModel {
        login: Set(register_json.login.clone()),
        email: Set(register_json.email.clone()),
        pass: Set(hashed_password),
        phone_number: Set(register_json.phone_number),
        create_date: Set(Utc::now().naive_utc()),
        modifate_date: Set(None),
        ..Default::default()
    }.insert(&app_state.db).await;

    match user_model {
        Ok(user) => {
            // Генерируем токен вместо возврата ID
            let token = encode_jwt(user.email.clone(), user.id as i32)
                .map_err(|err| ApiResponse::new(500, err.to_string()))?;
            
            // Возвращаем токен в формате JSON
            Ok(ApiResponse::new(200, format!("{{\"token\": \"{}\"}}", token)))
        },
        Err(e) => {
            eprintln!("Database error: {}", e);
            Err(ApiResponse::new(500, format!("Database error: {}", e)))
        }
    }
}
#[post("/login")]
pub async fn login(app_state: web::Data<app_state::AppState>, login_json: web::Json<LoginModel>) -> Result<ApiResponse,ApiResponse>{
     
    let user_data = entity::logins::Entity::find()
    .filter(
        Condition::all()
        .add(entity::logins::Column::Email.eq(&login_json.email))
        .add(entity::logins::Column::Pass.eq(digest(&login_json.password)))
     ).one(&app_state.db).await
     .map_err(|err| ApiResponse::new(500, err.to_string()))?
     .ok_or(ApiResponse::new(404, "Пользователя с таким именем не существует".to_owned()))?;

    let token = encode_jwt(user_data.email, user_data.id as i32)
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;
        if let Err(e) = email().await {
        eprintln!("Ошибка отправки email: {}", e);
        // Логируем, но не прерываем логин
    }

    Ok(api_responce::ApiResponse::new(200, format!("{{\"token\": \"{}\"}}", token)))
}

async fn email() -> Result<(), Box<dyn std::error::Error>> {
    smtp_full_server().await?;
    Ok(())
}


#[post("/password_reset_request")] 
pub async fn reqest_password_reset(
    app_state: web::Data<app_state::AppState>,
    reset_reqest: web::Json<PasswordResetRequest>, 
) -> Result<ApiResponse, ApiResponse> {
    // Проверка пустой ли Email
    if reset_reqest.email.trim().is_empty() {
        return Err(ApiResponse::new(400, "Email не может быть пустым".to_string()));
    }

    // Проверка существования Email в БД
    let user_exists = UserRepository::user_exists_by_email(
        &app_state.db,  
        &reset_reqest.email // 
    ).await
    .map_err(|err| ApiResponse::new(500, format!("Этот пользователь не существует или БД недоступна {}", err)))?;
    
    // Если мыла нет в системе
    if !user_exists {
        return Err(ApiResponse::new(404, "Пользователь не найден".to_string()));
    }

    // Создание секретного кода, ключа для смены пароля
    let mut rng = rand::thread_rng();
    let secret_code = rng.gen_range(100000..=999999);
    let reset_code = secret_code.to_string(); 
    let reset_code_string = reset_code.to_string();

    // Создание записи в БД
   let reset_record = entity::password_resets::ActiveModel {
    email: Set(reset_reqest.email.clone()),
    code: Set(reset_code_string.clone()),
    create_date: Set(Utc::now().naive_utc()),
    expires_date: Set(Utc::now().naive_utc() + chrono::Duration::minutes(15)),
    is_used: Set(false),
    ..Default::default()
};

let saved_record = reset_record.insert(&app_state.db)
    .await
    .map_err(|err| ApiResponse::new(500, format!("Ошибка сохранения кода: {}", err)))?;



    let email_body = format!(
    "Ваш код для сброса пароля: {}\n\nКод действует 15 минут. Не сообщайте его никому!",
    reset_code_string
);



    Ok(ApiResponse::new(200, format!("Код для сброса пароля: {}", reset_code)))
} 