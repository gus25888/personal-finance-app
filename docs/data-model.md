# Modelo de Datos Conceptual de la aplicación

El objetivo de este documento, es describir las tablas y columnas necesarias para poder recibir la información del proyecto.

## Tablas a definir

categories (Requisito para MVP)
  id number
  name text
  type text (income / expense)

movements (Requisito para MVP)
  id number
  description text
  date date
  amount number
  categoryId number
  userId number

users (Futura implementación post MVP)
  id number
  username text
  firstName text
  lastName text
  email text

Cada una de las tablas contará con las columnas adicionales:

  createdAt timestamp
  createdBy userId  (Futura implementación post MVP)
  updatedAt timestamp
  updatedBy userId  (Futura implementación post MVP)
  isActive Boolean

## Relaciones entre tablas

categories has multiple movements (Requisito para MVP)
movements belongs to one category (Requisito para MVP)
users has multiple movements  (Futura implementación post MVP)
movements belongs to one user  (Futura implementación post MVP)
