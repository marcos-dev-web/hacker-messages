/**
 * recognize the comand and return him
 * @param {string} command command string
 */
export function getCommand(command="") {
    const str = command.trim();
    let commandLine = "";

    if (str[0] !== '!') {
        return null;
    }

    let fullCommand = str.slice(1);

    for (let i = 1; i < fullCommand.length+1; i++) {
        if (str[i] !== ';') {
            commandLine += str[i];
        } else {
            break;
        }
    }

    return commandLine;
}