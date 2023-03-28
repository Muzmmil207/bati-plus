import uuid

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models

# Create your models here.


class UserManager(BaseUserManager):
    """ Manager for User Profile """

    def create_user(self,first_name, middle_name, last_name, email,  password=None):
        """Create a new user"""
        if not email:
            raise ValueError('User must have an email address')

        email = self.normalize_email(email)
        user = self.model( first_name=first_name, middle_name=middle_name, last_name=last_name, email=email)

        user.set_password(password)
        user.save(using=self._db)

        return user


    def create_superuser(self, first_name, middle_name, last_name, email,  password=None):
        """Create a new superuser"""
        user = self.create_user(first_name, middle_name, last_name, email, password)
        user.is_superuser = True
        user.is_staff = True

        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """ Database model for users in the system """
    id = models.UUIDField(primary_key= True, editable= False, default = uuid.uuid4,)
    first_name = models.CharField(max_length= 150)
    middle_name = models.CharField(max_length=60)
    last_name = models.CharField(max_length = 150)
    email = models.EmailField(max_length = 100, unique = True)

    is_active = models.BooleanField (default=True)
    is_staff = models.BooleanField(default = False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'middle_name','last_name']

    def __str__(self):
        return self.email
