class UserNotFound(Exception):
    """Такой пользователь не найден."""

class UserInvalidPass(Exception):
    """Неверный пароль."""

class UserAlreadyExists(Exception):
    """Пользователь уже существует."""