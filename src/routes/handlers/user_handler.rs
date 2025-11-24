//! Здесь ничего нет 


use actix_web::{get, web, Responder};
use crate::utils::{api_responce, app_state};




#[get("")]
pub async fn user(
    _app_state: web::Data<app_state::AppState> 
) -> impl Responder {

    api_responce::ApiResponse::new(200, "Verifyed user".to_string())
}