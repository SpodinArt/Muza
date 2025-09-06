use actix_web::{body::MessageBody, dev::{ServiceRequest, ServiceResponse}, http::header::AUTHORIZATION, middleware::Next, Error};
use sea_orm::sea_query::token;

use crate::utils::{api_responce::{self, ApiResponse}, jwt::decode_jwt};

pub async fn check_auth_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody>
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    let auth = req.headers().get(AUTHORIZATION);

    if auth.is_none() {
        return Err(Error::from(ApiResponse::new(401, "UnAutorizade".to_string())));
    }

    let token_str = auth.unwrap().to_str().map_err(|_| {
        Error::from(ApiResponse::new(400, "Invalid token format".to_string()))
    })?;


    let token = match token_str.strip_prefix("Bearer ") {
        Some(t) => t, 
        None => token_str 
    };


    let token = token.trim();

    println!("Cleaned token: '{}'", token);
    println!("Cleaned token length: {}", token.len());

    match decode_jwt(token) {
        Ok(claim) => {
            next.call(req).await.map_err(|err| {
                Error::from(ApiResponse::new(500, err.to_string()))
            })
        }
        Err(e) => {
            Err(Error::from(ApiResponse::new(401, format!("Invalid token: {}", e))))
        }
    }
}