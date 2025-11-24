use actix_web::{web::{self}};

use crate::routes::{handlers, middlewares::{auth_middlewares::check_auth_middleware}};



pub fn config(config: &mut web::ServiceConfig) {
    config.service(
        web::scope("/user")
            .wrap(actix_web::middleware::from_fn(check_auth_middleware))
            .service(handlers::user_handler::user)
    );
}