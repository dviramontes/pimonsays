const {execFile}  = require('child_process');

// pi@raspberrypi:~/Documents/rpi-rgb-led-matrix/python/samples $ sudo python newtext.py -r=16 -t="Good Bye Tyler :'("

let proc;

export function display(name) {
    if (proc) proc.kill('SIGINT');
    proc = execFile('python', [`/home/pi/Documents/rpi-rgb-led-matrix/python/samples/newtext.py`, `-r=16`, `-t="${name}"`], (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        console.log(stdout);
    });
}
