class InvalidPassword(Exception):
    """Неверный пароль."""



class UserNotFound(Exception):
    """Такой пользователь не найден."""

class UserAlreadyExists(Exception):
    """Пользователь уже существует."""



class GroupAlreadyExists(Exception):
    """Группа уже существует."""

class GroupNotFound(Exception):
    """Такая группа не найдена."""

class UserBannedInGroup(Exception):
    """Пользователь забанен в группе."""

class UserAlreadyInGroup(Exception):
    """Пользователь уже в группе"""