const ANTI_CAPTCHA_KEY = 'caec2956397886d5c556fcae0f2d4b35'

import axios from 'axios'
import fs from 'fs'

for (let i = 0; i < 100000; i++) {
    //get captcha
    const get_captche_response = await axios.get('https://check.gibdd.ru/captcha')
    const {token, base64jpg} = get_captche_response.data

    //solve captcha
    const create_task_response = await axios.post('https://api.anti-captcha.com/createTask', {
        clientKey: ANTI_CAPTCHA_KEY,
        task:
            {
                type: 'ImageToTextTask',
                body: base64jpg,
                phrase: false,
                case: false,
                numeric: 1,
                math: false,
                minLength: 5,
                maxLength: 5
            },
        softId: 0
    })
    const taskId = create_task_response.data.taskId

    let solved_task_response
    do {
        solved_task_response = await axios.post('https://api.anti-captcha.com/getTaskResult', {
            clientKey: ANTI_CAPTCHA_KEY,
            taskId
        })
    } while (solved_task_response.data.status != 'ready')

    //write file
    const binaryData = new Buffer(base64jpg, 'base64').toString('binary')
    let filename = `images/${solved_task_response.data.solution.text}.jpg`

    //preserve duplicates
    let j = 1
    while (fs.existsSync(filename)) {
        filename = `images/${solved_task_response.data.solution.text}-${j}.jpg`
        j++
    }

    await fs.writeFileSync(filename, binaryData, 'binary')
    console.log(`${i} successfully processed`)
}