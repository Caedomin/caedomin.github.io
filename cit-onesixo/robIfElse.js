let day = new Date().getDay();
if (day == 0 || day == 6) 
{
    if (day == 0)
    {
        print("Today is Sunday!");
    }
    else
    {
        print("Today is Saturday!");
    }
    moveForward();
    moveForward();
    moveForward();
    moveForward();
    moveForward();
    moveForward();
    print("Woot!");
} 
else if (day == 1 || day == 3 || day == 5)
{
    if (day == 1)
    {
        print("Today is Monday!");
    }
    else if (day == 3)
    {
        print("Today is Wednesday!");
    }
    else
    {
        print("Today is Friday!");
    }
    turnRight();
    moveForward();
    moveForward();
    moveForward();
    moveForward();
    print("Woot!");
}
else
{
    if (day == 2)
    {
        print("Today is Tuesday!");
    }
    else
    {
        print("Today is Thursday!");
    }
    moveForward();
    moveForward();
    moveForward();
    moveForward();
    moveForward();
    moveForward();
    turnRight();
    moveForward();
    moveForward();
    moveForward();
    moveForward();
    print("Woot!");
}
