Feature: Flujo productos
    @POM
    Scenario: Compra de productos
        Given Estoy logueado
        When Agrego un producto al carrito
        Then Se completa la compra del productos
        
    @POM2
    Scenario: Compra de productos2
        Given Estoy logueado con "Alguien"

    @POM3
    Scenario: Compra de productos3
        Given Tengo una lista de productos  
        | PROD01 |
        | PROD02 |
        | PROD03 |
