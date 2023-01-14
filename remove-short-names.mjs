import fs from 'fs'

for(let i = 0; i < 10; i++){
    const path = `/Users/mrkutin/captcha-solver/dataset/training_set/${i}`
    const dirCont = fs.readdirSync( path )
    const files = dirCont.filter( ( elm ) => elm.match(/jpg$/ig))

    files.forEach(file => {
        fs.renameSync(
            `${path}/${file}`,
            `${path}/0.${file}`)
        console.log()
    })
}



console.log()