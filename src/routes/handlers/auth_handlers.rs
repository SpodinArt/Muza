use std::default;
use std::ptr::dangling;
use chrono::Utc;
use sha256::digest;
use uuid::Uuid;
use actix_web::{post, web, Responder};
use serde::Deserialize;
use serde::Serialize;
use crate::utils::api_responce::ApiResponse;
use crate::utils::jwt::encode_jwt;
use crate::utils::{api_responce, app_state};
use sea_orm::{ActiveModelTrait, Condition, ColumnTrait, EntityTrait, QueryFilter, Set};

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
pub async fn register(app_state: web::Data<app_state::AppState>, register_json: web::Json<RegisterModel>) -> Result<ApiResponse,ApiResponse> {
    
    let user_model = entity::logins::ActiveModel {
        login: Set(register_json.login.clone()),
        email: Set(register_json.email.clone()),
        pass: Set(digest(&register_json.password)),
        phone_number: Set(register_json.phone_number),
        create_date: Set(Utc::now().naive_utc()),
        modifate_date: Set(None),
        ..Default::default()
    }.insert(&app_state.db).await
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;

Ok(api_responce::ApiResponse::new(200, format!("{}", user_model.id)))


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