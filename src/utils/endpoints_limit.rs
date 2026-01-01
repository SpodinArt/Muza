//! ограничение обращения к эндпоинту
//! при обращении на важные поинты устанавливаем в бд counter и data_time и проверяем сколько, за период времени было обращений


use chrono::{Duration, Utc};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};


pub async fn limitation_generate_code(
    db: &DatabaseConnection,
    email: &str
) -> bool {

    let now = Utc::now().naive_utc();

    // Ищем единственную запись по email (всегда одна)
    match entity::password_resets::Entity::find()
        .filter(entity::password_resets::Column::Email.eq(email))
        .one(db)
        .await
    {
        Ok(Some(record)) => {

            now >= record.create_date + Duration::minutes(1)
        },
        Ok(None) => {
            eprintln!("Записи не существует");
            false
        },
        Err(err) => {
            eprintln!("Ошибка при проверке ограничений: {}", err);
            false
        }
    }
}







