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

#[post("/register")]
pub async fn register(
    app_state: web::Data<app_state::AppState>,
    register_json: web::Json<RegisterModel>
) -> impl Responder {
    
    // Проверка существования email
    if UserRepository::user_exists_by_email(&app_state.db, &register_json.email).await.unwrap_or(false) {
        return ApiResponse::new(409, "Мыло уже существует чувак".to_string());
    }
    
    // Проверка существования login
    if UserRepository::user_exists_by_login(&app_state.db, &register_json.login).await.unwrap_or(false) {
        return ApiResponse::new(409, "Твой логин уже поюзали".to_string());
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
        Ok(user) => ApiResponse::new(200, format!("User created with ID: {}", user.id)),
        Err(e) => {
            eprintln!("Database error: {}", e);
            ApiResponse::new(500, format!("Database error: {}", e))
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