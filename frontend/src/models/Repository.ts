export interface IRepository {
  name: string
  format: string
  type: string
  url: string
  attributes: Attributes
}

export interface Attributes {
  additionalProp1: AdditionalProp1
  additionalProp2: AdditionalProp2
  additionalProp3: AdditionalProp3
}

export interface AdditionalProp1 {}

export interface AdditionalProp2 {}

export interface AdditionalProp3 {}
