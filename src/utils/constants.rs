//! Подключение к константам

use std::{env};
use lazy_static::lazy_static;

lazy_static!{
    pub static ref ADDRESS: String = set_address();
        pub static ref DATABASE_URL: String = set_database_url();   
        pub static ref SECRET: String = set_secret();   
        pub static ref PORT: u16 = set_port();   
        pub static ref SMTP_HOST: String = set_smtp_host();   
        pub static ref SMTP_PORT: u16 = set_smtp_port();   
        pub static ref SMTP_USERNAME: String = set_smtp_email();   
        pub static ref SMTP_PASSWORD: String = set_smtp_pass();   
        pub static ref FROM_NAME: String = set_name_app();   
}

 fn set_address() -> String {
    dotenv::dotenv().ok();
    env::var("ADDRESS").unwrap_or("127.0.0.1".to_string())
 }

 fn set_database_url() -> String {
    dotenv::dotenv().ok();
    env::var("DATABASE_URL").expect("postgres://postgres:12345@localhost:5432/Muza")
 }

 fn set_secret() -> String{
    dotenv::dotenv().ok();
    env::var("SECRET").unwrap_or("SECRET".to_string())
 }

fn set_port() -> u16 {
    dotenv::dotenv().ok();
    env::var("PORT").unwrap_or("5050".to_owned())
        .parse::<u16>().expect("cant parse the port")
 }

fn set_smtp_host() -> String {
    dotenv::dotenv().ok();
    env::var("SMTP_HOST").unwrap_or("smtp.yandex.ru".to_string())
 }

 fn set_smtp_port() -> u16 {
    dotenv::dotenv().ok();
    env::var("SMTP_PORT").unwrap_or("587".to_owned())
        .parse::<u16>().expect("cant parse the port")
 }

 fn set_smtp_email() -> String {
    dotenv::dotenv().ok();
    env::var("SMTP_USERNAME").unwrap_or("SMTP_USERNAME".to_string())
 }

 fn set_smtp_pass() -> String {
    dotenv::dotenv().ok();
    env::var("SMTP_PASSWORD").unwrap_or("SMTP_PASSWORD".to_string())
 }

 fn set_name_app() -> String {
    dotenv::dotenv().ok();
    env::var("FROM_NAME").unwrap_or("Muza".to_string())
 }
