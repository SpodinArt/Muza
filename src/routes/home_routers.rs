use actix_web::web::{self};

use crate::routes::handlers;



pub fn config(config: &mut web::ServiceConfig){
    config
    .service(web::scope("/")
        .service(handlers::home_handler::greet)
        .service(handlers::home_handler::test));
}