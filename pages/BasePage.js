import { Selector } from "testcafe";

export class BasePage {

    baseUrl = 'http://www.ericrochester.com/name-game/';

    title = Selector(".header");

    firstPhoto = Selector('.shade').withText('1');
    secondPhoto = Selector('.shade').withText('2');
    thirdPhoto = Selector('.shade').withText('3');
    fourthPhoto = Selector('.shade').withText('4');
    fifthPhoto = Selector('.shade').withText('5');
        
    attempts = Selector(".attempts");
    correct = Selector(".correct");
    streak = Selector(".streak");

    name = Selector('#name');

}