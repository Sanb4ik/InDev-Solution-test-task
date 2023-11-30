<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Installation and Start

```bash
$ docker compose up
```

## Подключение pgAdmin4
Чтобы подключиться к серверу PostgreSQL из PgAdmin, нам нужно создать объект сервера в PgAdmin с подробной информацией о сервере PostgreSQL.

Вот шаги по созданию сервера в PgAdmin:

Откройте PgAdmin в веб-браузере, посетив http://localhost:5050 (при условии, что мы используем конфигурацию по умолчанию в docker-compose.ymlфайле).
Войдите, используя свой адрес электронной почты и пароль (admin@admin.com pgadmin4), указанные в docker-compose.yml файле сервиса pgadmin.
На левой боковой панели нажмите Servers, чтобы развернуть Servers меню.
Щелкните правой кнопкой мыши Servers и выберите Register-> Server.
На General вкладке диалога Create - Server мы можем дать серверу имя по нашему выбору.
Во Connection вкладке заполните следующие данные:

Имя/адрес хоста: db

Порт: 5432

База данных обслуживания: postgres

Имя пользователя: postgres

Пароль: postgres

Нажмите Save, чтобы сохранить конфигурацию сервера postgres.
## Работа с Swagger
Откройте веб-браузер, затем откройте http://localhost:3000/api 
Обратите внимание, что для маршута 'api/auth/logout' используется access_token, а для маршута 'api/auth/refresh' используется refresh_token.
## P.s.
Даннуюлогику аутентификации я уже реализовыввал в одном из своих pet проектов, но не использовал свои декораторы, для получения userId and userData и  не использовал Docker : ) https://github.com/Sanb4ik/EventMakers/tree/feature/subscribers



