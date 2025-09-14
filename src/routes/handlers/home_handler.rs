use std::path;

use actix_web::http::header;

use actix_web::{get, web, Responder, HttpResponse};
use sea_orm::{ConnectionTrait, Statement};



use crate::utils::{api_responce::{self, ApiResponse}, app_state::AppState};




#[get("")]
pub async fn greet(name: web::Path<String>) -> impl Responder {
    api_responce::ApiResponse::new(200, format!("Hello {name}!"))

}

#[get("/guest/{page}")]
pub async fn guest_page(path: web::Path<String>) -> Result<HttpResponse, ApiResponse> {
    let page = path.into_inner();
    let valid_pages = ["guest", "registration", "login"]; // Список разрешенных страниц
    
    if !valid_pages.contains(&page.as_str()) {
        return Err(ApiResponse::new(404, "Page not found".to_string()));
    }
    
    let content = std::fs::read_to_string(format!("static/{}.html", page))
        .map_err(|_| ApiResponse::new(500, "Failed to read page".to_string()))?;
    
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(content))
}

#[get("/guest")]
pub async fn guest_root() -> Result<HttpResponse, ApiResponse> {
    let content = std::fs::read_to_string("static/guest.html")
        .map_err(|_| ApiResponse::new(500, "Failed to read guest.html".to_string()))?;
    
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(content))
}


#[get("/test")]
pub async fn test(app_state: web::Data<AppState>) -> Result<ApiResponse,ApiResponse> {

    let res = app_state.db.query_all(Statement::from_string(sea_orm::DatabaseBackend::Postgres, "Select * from logins")).await
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;
    Ok(api_responce::ApiResponse::new(200, "Test".to_string()))
}