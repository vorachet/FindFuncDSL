# Headless IDEF0-Like-Dsl-to-Dotfile-Compiler

# Pizza

## Input

```
idef0 Pizza
concepts
	Ingredients HungryCustomer CustomerOrder
	Pizza Mess SatisifedCustomer Menu
	Recipe Menu WaitStaff Chef Kitchen

func TakeOrder (
	produces CustomerOrder
	respects Menu
	requires WaitStaff
)

func CookPizza (
	receives Ingredients Recipe
	produces Pizza
	respects CustomerOrder
	requires Chef Kitchen
)

func EatPizza (
	receives HungryCustomer Pizza
	produces Mess SatisifedCustomer
)

diagram PizzaOperations title "Pizza Operations" funcs (TakeOrder CookPizza EatPizza)
diagram CookAndEatPizza title "Cook and Eat Pizza" funcs (CookPizza EatPizza)
diagram PizzTakeOrder title "TakeOrder" funcs (TakeOrder)
diagram PizzCookPizza title "CookPizza" funcs (CookPizza)
diagram PizzEatPizza title "EatPizza" funcs (EatPizza)
```

## Run compiler

```
java -jar idef0.jar projects/Pizza.idef0
```

## Output

```
open src-gen/Pizza/index.html
```

![Logo](https://github.com/vorachet/IDEF0-Dsl-to-Dotfile-Compiler/raw/master/images/Pizza.png)

```
java -jar idef0.jar projects/ProjectPlan.idef0

open src-gen/Pizza/index.html
```

```
java -jar idef0.jar projects/SweKernel.idef0
```

```
java -jar idef0.jar projects/UserStories.idef0
```
