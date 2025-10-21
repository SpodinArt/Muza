use chrono::Utc;
use sha256::digest;
use actix_web::{post, web, Responder};
use serde::Deserialize;
use serde::Serialize;
use crate::utils::api_responce::ApiResponse;
use crate::utils::jwt::encode_jwt;
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
struct ChangePasswordModel {
    email: String,
    old_password: String,
    new_password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ForgotPasswordModel {
    email: String,
}

#[post("/register")]
pub async fn register(
    app_state: web::Data<app_state::AppState>,
    register_json: web::Json<RegisterModel>
) -> Result<ApiResponse, ApiResponse> {  // ← Изменить на Result
    
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


    Ok(api_responce::ApiResponse::new(200, format!("{{\"token\": \"{}\"}}", token)))
}
#[post("/change-password")] // изменение пароля
pub async fn change_password(
    app_state: web::Data<app_state::AppState>,
    password_json: web::Json<ChangePasswordModel>
) -> Result<ApiResponse, ApiResponse> {
    
    // Находим пользователя по email
    let user_data = entity::logins::Entity::find()
        .filter(entity::logins::Column::Email.eq(&password_json.email))
        .one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?
        .ok_or(ApiResponse::new(404, "Пользователь с таким email не найден".to_owned()))?;

    // Проверяем старый пароль
    let hashed_old_password = digest(&password_json.old_password);
    if user_data.pass != hashed_old_password {
        return Err(ApiResponse::new(401, "Неверный старый пароль".to_string()));
    }

    // Хешируем новый пароль
    let hashed_new_password = digest(&password_json.new_password);

    // Обновляем пароль в базе данных
    let mut user_model: entity::logins::ActiveModel = user_data.into();
    user_model.pass = Set(hashed_new_password);
    user_model.modifate_date = Set(Some(Utc::now().naive_utc()));

    user_model.update(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, format!("Ошибка обновления пароля: {}", err)))?;

    Ok(ApiResponse::new(200, "Пароль успешно изменен".to_string()))
}

#[post("/forgot-password")] // Запрос на сброс пароля
pub async fn forgot_password(
    app_state: web::Data<app_state::AppState>,
    forgot_json: web::Json<ForgotPasswordModel>
) -> Result<ApiResponse, ApiResponse> {
    
    // Проверяем существование email
    if !UserRepository::user_exists_by_email(&app_state.db, &forgot_json.email).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))? {
        return Err(ApiResponse::new(404, "Пользователь с таким email не найден".to_string()));
    }

    // Здесь можно добавить логику отправки email с ссылкой для сброса пароля
    // Пока просто возвращаем сообщение
    Ok(ApiResponse::new(200, "Инструкции по сбросу пароля отправлены на email".to_string()))
}