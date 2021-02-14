import { BasePage } from "../pages/BasePage";

const page = new BasePage();

fixture`Home`.page(page.baseUrl);

test('Correct title displays', async t => {
    await t
        .expect(page.title.textContent)
        .eql("name game");
});

test('Attempts counter increments after selecting a photo', async t => {
    const initialAttemptsCount = Number(await page.attempts.textContent);
    
    await t.click(page.firstPhoto);

    const finalAttemptsCount = Number(await page.attempts.textContent);

    await t
        .expect(finalAttemptsCount)
        .eql(initialAttemptsCount + 1);
});

//TODO: This can probably be way more elegant -- do more research on TestCafe; probably refactor out to the 
//      page object to simplify finding correct answer
test('Verify the streak counter is incrementing on correct selections', async t => {
    // This gets the name we are looking for from the center-text div
    const correctName = await page.name.textContent;

    // This gets the names associated with all of the options' photos
    const firstPhotoName = await page.firstPhoto.sibling(".name").textContent;
    const secondPhotoName = await page.secondPhoto.sibling(".name").textContent;
    const thirdPhotoName = await page.thirdPhoto.sibling(".name").textContent;
    const fourthPhotoName = await page.fourthPhoto.sibling(".name").textContent;
    const fifthPhotoName = await page.fifthPhoto.sibling(".name").textContent;

    const currentCorrect =  Number(page.correct.textContent);
    const currentStreak = Number(page.streak.textContent);
    
    // Click on the photo whose name matches the name we are looking for
    if (correctName === firstPhotoName) {
        await t.click(page.firstPhoto);
    } else if (correctName === secondPhotoName) {
        await t.click(page.secondPhoto);
    } else if (correctName === thirdPhotoName) {
        await t.click(page.thirdPhoto);
    } else if (correctName === fourthPhotoName) {
        await t.click(page.fourthPhoto);
    } else if (correctName === fifthPhotoName) {
        await t.click(page.fifthPhoto);
    } else {
        // Additional logging in case the correct answer doesn't appear
        console.log(`No matches found; Expected ${correctName} and found:
             ${firstPhotoName}, ${secondPhotoName}, ${thirdPhotoName}, ${fourthPhotoName}, ${fifthPhotoName}`);
    }

    const finalCorrect = Number(page.correct.textContent);
    const finalStreak = Number(page.streak.textContent);

    await t
        .expect(finalCorrect)
        .eql(currentCorrect + 1);
    await t
        .expect(finalStreak)
        .eql(currentStreak + 1);
});

test('Verify the multiple streak counter resets after getting an incorrect answer', async t => {
    // This gets the name we are looking for from the center-text div
    const correctName = await page.name.textContent;

    // This gets the names associated with all of the options' photos that we need
    const firstPhotoName = await page.firstPhoto.sibling(".name").textContent;

    // Due to previous test forcing a correct answer, we can be sure streak > 0, but check anyway
    // TODO: For future proofing, do an if else where if !streak>0, give a correct answer to make it 1 
    const currentStreak = Number(await page.streak.textContent);
   
    await t
        .expect(currentStreak)
        .gt(0);
    
    // DON'T click on the photo whose name matches the name we are looking for (we only need to check 2 for this)
    if (correctName === firstPhotoName) {
        await t.click(page.secondPhoto);
    } else {
        await t.click(page.firstPhoto);
    }

    // Ensure streak is reset
    await t.wait(500);
    const finalStreak = Number(await page.streak.textContent);
    await t
        .expect(finalStreak)
        .eql(0);
});

test('Verify that the correct counters are being incremented for tries and correct counters', async t => {
    // This gets the name we are looking for from the center-text div
    const correctName = await page.name.textContent;

    // This gets the names associated with all of the options' photos
    const firstPhotoName = await page.firstPhoto.sibling(".name").textContent;
    const secondPhotoName = await page.secondPhoto.sibling(".name").textContent;
    const thirdPhotoName = await page.thirdPhoto.sibling(".name").textContent;
    const fourthPhotoName = await page.fourthPhoto.sibling(".name").textContent;
    const fifthPhotoName = await page.fifthPhoto.sibling(".name").textContent;

    const currentCorrect =  await Number(page.correct.textContent);
    const currentAttempts = Number(await page.attempts.textContent);
    
    //On an incorrect answer, streak and correct do not increment, but tries does
    if (correctName === firstPhotoName) {
        await t.click(page.secondPhoto);
    } else {
        await t.click(page.firstPhoto);
    }
    
    await t.wait(500);
    
    const incorrectCurrentCorrect =  await Number(page.correct.textContent);
    const incorrectCurrentAttempts = await Number(await page.attempts.textContent);
    const incorrectCurrentStreak = Number(await page.streak.textContent);

    await t
        .expect(incorrectCurrentCorrect)
        .eql(currentCorrect);
    await t
        .expect(incorrectCurrentStreak)
        .eql(0);
    await t
        .expect(incorrectCurrentAttempts)
        .eql(currentAttempts + 1);
    
    await t.wait(500);

    //On a correct answer, streak, tries and correct increment
    // Click on the photo whose name matches the name we are looking for
    if (correctName === firstPhotoName) {
        await t.click(page.firstPhoto);
    } else if (correctName === secondPhotoName) {
        await t.click(page.secondPhoto);
    } else if (correctName === thirdPhotoName) {
        await t.click(page.thirdPhoto);
    } else if (correctName === fourthPhotoName) {
        await t.click(page.fourthPhoto);
    } else if (correctName === fifthPhotoName) {
        await t.click(page.fifthPhoto);
    } else {
        // Additional logging in case the correct answer doesn't appear
        console.log(`No matches found; Expected ${correctName} and found:
             ${firstPhotoName}, ${secondPhotoName}, ${thirdPhotoName}, ${fourthPhotoName}, ${fifthPhotoName}`);
    }

    await t.wait(500);

    const finalCorrect =  await Number(page.correct.textContent);
    const finalAttempts = Number(await page.attempts.textContent);
    const finalStreak = Number(await page.streak.textContent);

    await t
        .expect(finalCorrect)
        .eql(incorrectCurrentCorrect + 1);
    await t
        .expect(finalStreak)
        .eql(1);
    await t
        .expect(finalAttempts)
        .eql(incorrectCurrentAttempts + 1);

});

test('Verify name and displayed photos change after selecting the correct answer', async t => {
    // This gets the name we are looking for from the center-text div
    const correctName1 = await page.name.textContent;

    // This gets the names associated with all of the options' photos
    const firstPhotoName1 = await page.firstPhoto.sibling(".name").textContent;
    const secondPhotoName1 = await page.secondPhoto.sibling(".name").textContent;
    const thirdPhotoName1 = await page.thirdPhoto.sibling(".name").textContent;
    const fourthPhotoName1 = await page.fourthPhoto.sibling(".name").textContent;
    const fifthPhotoName1 = await page.fifthPhoto.sibling(".name").textContent;

    // Give a correct answer so we can get to the next challenge
    if (correctName1 === firstPhotoName1) {
        await t.click(page.firstPhoto);
    } else if (correctName1 === secondPhotoName1) {
        await t.click(page.secondPhoto);
    } else if (correctName1 === thirdPhotoName1) {
        await t.click(page.thirdPhoto);
    } else if (correctName1 === fourthPhotoName1) {
        await t.click(page.fourthPhoto);
    } else if (correctName1 === fifthPhotoName1) {
        await t.click(page.fifthPhoto);
    } else {
        // Additional logging in case the correct answer doesn't appear
        console.log(`No matches found; Expected ${correctName1} and found:
             ${firstPhotoName1}, ${secondPhotoName1}, ${thirdPhotoName1}, ${fourthPhotoName1}, ${fifthPhotoName1}`);
    }

    // Wait for the photoCorrect Selector to go away so we know the challenge is refreshed
    // This takes a while. Future improvements could introduce a hidden debug element to make this smarter
    await t.wait(10000);

    // This gets the new name we are looking for from the center-text div
    const correctName2 = await page.name.textContent;

    // This gets the new names associated with all of the options' photos
    const firstPhotoName2 = await page.firstPhoto.sibling(".name").textContent;
    const secondPhotoName2 = await page.secondPhoto.sibling(".name").textContent;
    const thirdPhotoName2 = await page.thirdPhoto.sibling(".name").textContent;
    const fourthPhotoName2 = await page.fourthPhoto.sibling(".name").textContent;
    const fifthPhotoName2 = await page.fifthPhoto.sibling(".name").textContent;

    // Note: In the client scope it says throwing an incorrect answer makes it more likely to reoccur, and a correct answer
    // less likely to reoccur. This could potentially end up a false negative since there CAN be repeats, but given the 
    // few number of challenges it's attempting and the unlikliness that a repeat will appear at the same index as the previous
    // challenge, I'm not too fussed about tightening this up. 
    await t
        .expect(correctName2)
        .notEql(correctName1);
    await t
        .expect(firstPhotoName2)
        .notEql(firstPhotoName1);
    await t
        .expect(secondPhotoName2)
        .notEql(secondPhotoName1);
    await t
        .expect(thirdPhotoName2)
        .notEql(thirdPhotoName1);
    await t
        .expect(fourthPhotoName2)
        .notEql(fourthPhotoName1);
        await t
        .expect(fifthPhotoName2)
        .notEql(fifthPhotoName1);
});