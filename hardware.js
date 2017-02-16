const execFile = require('child_process').execFile;

// pi@raspberrypi:~/Documents/rpi-rgb-led-matrix/python/samples $ sudo python newtext.py -r=16 -t="Good Bye Tyler :'("

module.exports.display = (name) => {
    execFile('python', [`newtext.py -r=16 -t="${name}"`], (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        console.log(stdout);
    });
}