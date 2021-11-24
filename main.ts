radio.setGroup(1)
radio.setTransmitPower(7)
radio.sendString("yeah")
let charPos = randint(0, 4)
let turn = false
let gameOver = true
let started = false
let received = false
let movable = false
// PairSend
// ReceiveStr
// ReceiveNum
// Move Left
// Move Right
// Fire
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (movable == true && gameOver == false) {
        if (charPos > 0) {
            led.unplot(charPos, 4)
            charPos = charPos - 1
            led.plot(charPos, 4)
        }
        
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    if (movable == true && gameOver == false) {
        if (charPos < 4) {
            led.unplot(charPos, 4)
            charPos = charPos + 1
            led.plot(charPos, 4)
        }
        
    }
    
})
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    if (turn == true && gameOver == false) {
        turn = false
        for (let i = 0; i < 5; i++) {
            led.plot(charPos, 3 - i)
            if (i != 0) {
                led.unplot(charPos, 4 - i)
            }
            
            console.log(3 - i)
            pause(100)
        }
        radio.sendNumber(charPos)
        // retry
        pause(1000)
        while (true) {
            if (received == false) {
                radio.sendNumber(charPos)
                pause(1000)
            } else {
                break
            }
            
        }
    }
    
})
input.onGesture(Gesture.Shake, function on_gesture_shake() {
    let pairId: number;
    
    if (gameOver == true && started == false) {
        pairId = randint(11, 100)
        console.log(pairId)
        radio.sendNumber(pairId)
        radio.setGroup(pairId)
        gameOver = false
        started = true
        led.plot(charPos, 4)
        turn = true
        movable = true
    }
    
})
radio.onReceivedNumber(function on_received_number(receivedNumber: number) {
    
    // ReceiveBullet
    if (receivedNumber < 10) {
        turn = false
        movable = false
        radio.sendString("ReceivedShot")
        for (let i = 0; i < 6; i++) {
            if (i != 5) {
                led.plot(receivedNumber, i)
                led.unplot(receivedNumber, i - 1)
                pause(100)
            } else {
                led.unplot(receivedNumber, i - 1)
                if (receivedNumber == charPos) {
                    gameOver = true
                    radio.sendString("Hit")
                    basic.showString("You Lose")
                }
                
            }
            
        }
        turn = true
        movable = true
    } else if (gameOver == true && started == false) {
        radio.setGroup(receivedNumber)
        console.log("paired")
        gameOver = false
        started = true
        led.plot(charPos, 4)
        movable = true
    }
    
})
radio.onReceivedString(function on_received_string(receivedString: string) {
    
    if (receivedString == "Hit") {
        gameOver = true
        basic.showString("You Win")
    } else if (receivedString == "ReceivedShot") {
        received = true
    }
    
})
