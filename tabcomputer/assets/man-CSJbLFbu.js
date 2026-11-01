import{an as u}from"./index-3dop0BuN.js";const d=Object.freeze(Object.defineProperty({__proto__:null,get manCmd(){return h}},Symbol.toStringTag,{value:"Module"})),$="\x1B[1m",t="\x1B[4m",e="\x1B[0m",m={ls:`${$}LS(1)${e}                     tabcomputer Manual                    ${$}LS(1)${e}

${$}NAME${e}
       ls - list directory contents

${$}SYNOPSIS${e}
       ${$}ls${e} [${t}OPTION${e}]... [${t}FILE${e}]...

${$}DESCRIPTION${e}
       List information about the FILEs (the current directory by default).

       ${$}-a${e}, ${$}--all${e}
              do not ignore entries starting with .

       ${$}-l${e}     use a long listing format

       ${$}-R${e}, ${$}--recursive${e}
              list subdirectories recursively

       ${$}-h${e}, ${$}--human-readable${e}
              with -l, print sizes in human readable format

       ${$}-t${e}     sort by modification time, newest first

       ${$}-r${e}     reverse order while sorting

       ${$}-S${e}     sort by file size, largest first

       ${$}-1${e}     list one file per line
`,cat:`${$}CAT(1)${e}                    tabcomputer Manual                   ${$}CAT(1)${e}

${$}NAME${e}
       cat - concatenate files and print on standard output

${$}SYNOPSIS${e}
       ${$}cat${e} [${t}OPTION${e}]... [${t}FILE${e}]...

${$}DESCRIPTION${e}
       Concatenate FILE(s) to standard output. With no FILE, read stdin.

       ${$}-n${e}     number all output lines

       ${$}-b${e}     number nonempty output lines (overrides -n)

       ${$}-s${e}     suppress repeated empty output lines

       ${$}-E${e}     display $ at end of each line
`,grep:`${$}GREP(1)${e}                   tabcomputer Manual                  ${$}GREP(1)${e}

${$}NAME${e}
       grep - print lines that match patterns

${$}SYNOPSIS${e}
       ${$}grep${e} [${t}OPTION${e}]... ${t}PATTERN${e} [${t}FILE${e}]...

${$}DESCRIPTION${e}
       grep searches for PATTERN in each FILE. By default, grep prints
       the matching lines.

       ${$}-i${e}, ${$}--ignore-case${e}
              ignore case distinctions in patterns and data

       ${$}-v${e}, ${$}--invert-match${e}
              select non-matching lines

       ${$}-c${e}, ${$}--count${e}
              print a count of matching lines

       ${$}-n${e}, ${$}--line-number${e}
              prefix each line with its line number

       ${$}-r${e}, ${$}--recursive${e}
              read all files under each directory recursively

       ${$}-l${e}, ${$}--files-with-matches${e}
              print only names of FILEs with matches

       ${$}-w${e}, ${$}--word-regexp${e}
              match only whole words

       ${$}-E${e}, ${$}--extended-regexp${e}
              interpret PATTERN as an extended regular expression

       ${$}-o${e}, ${$}--only-matching${e}
              show only the part of a line matching PATTERN

       ${$}-A${e} ${t}NUM${e}
              print NUM lines of trailing context

       ${$}-B${e} ${t}NUM${e}
              print NUM lines of leading context

       ${$}-C${e} ${t}NUM${e}
              print NUM lines of output context

${$}EXAMPLES${e}
       grep -rn "TODO" src/
              Search for TODO in all files under src/

       echo "hello world" | grep -o "world"
              Extract matching portion only

       grep -c "error" log.txt
              Count error occurrences
`,sed:`${$}SED(1)${e}                    tabcomputer Manual                   ${$}SED(1)${e}

${$}NAME${e}
       sed - stream editor for filtering and transforming text

${$}SYNOPSIS${e}
       ${$}sed${e} [${t}OPTION${e}]... ${t}SCRIPT${e} [${t}FILE${e}]...

${$}DESCRIPTION${e}
       Sed reads input line by line, applies SCRIPT commands, and
       writes the result to standard output.

       ${$}-n${e}     suppress automatic printing of pattern space

       ${$}-i${e}     edit files in place

       ${$}-e${e} ${t}script${e}
              add the script to the commands to be executed

${$}COMMANDS${e}
       ${$}s/${e}${t}regexp${e}${$}/${e}${t}replacement${e}${$}/${e}${t}flags${e}
              Substitute regexp with replacement. Flags: g (global),
              p (print), i (case-insensitive), number (nth occurrence).

       ${$}d${e}     Delete pattern space.

       ${$}p${e}     Print pattern space.

       ${$}q${e}     Quit.

${$}EXAMPLES${e}
       sed 's/old/new/g' file.txt
              Replace all occurrences of old with new

       sed -n '10,20p' file.txt
              Print lines 10 through 20
`,awk:`${$}AWK(1)${e}                    tabcomputer Manual                   ${$}AWK(1)${e}

${$}NAME${e}
       awk - pattern scanning and text processing language

${$}SYNOPSIS${e}
       ${$}awk${e} [${t}OPTION${e}]... ${t}PROGRAM${e} [${t}FILE${e}]...

${$}DESCRIPTION${e}
       Awk scans each input line for patterns and performs actions.

       ${$}-F${e} ${t}sep${e}
              set field separator (default: whitespace)

${$}BUILT-IN VARIABLES${e}
       ${$}NR${e}     current record number
       ${$}NF${e}     number of fields in current record
       ${$}$0${e}     entire current record
       ${$}$1..$N${e} individual fields

${$}EXAMPLES${e}
       awk '{print $1}' file.txt
              Print first field of each line

       awk -F: '{print $1, $3}' /etc/passwd
              Print username and UID

       awk 'NR==5,NR==10' file.txt
              Print lines 5 through 10
`,find:`${$}FIND(1)${e}                   tabcomputer Manual                  ${$}FIND(1)${e}

${$}NAME${e}
       find - search for files in a directory hierarchy

${$}SYNOPSIS${e}
       ${$}find${e} [${t}path${e}] [${t}expression${e}]

${$}DESCRIPTION${e}
       Search for files matching criteria under the given path.

       ${$}-name${e} ${t}pattern${e}
              match filename by glob pattern

       ${$}-type${e} ${t}c${e}
              file type: f (regular file), d (directory)

       ${$}-maxdepth${e} ${t}N${e}
              descend at most N levels

       ${$}-exec${e} ${t}command${e} {} \\;
              execute command on each match

${$}EXAMPLES${e}
       find . -name "*.ts" -type f
              Find all TypeScript files

       find /tmp -name "*.log" -exec rm {} \\;
              Delete all log files in /tmp
`,cd:`${$}CD(1)${e}                     tabcomputer Manual                    ${$}CD(1)${e}

${$}NAME${e}
       cd - change the working directory

${$}SYNOPSIS${e}
       ${$}cd${e} [${t}dir${e}]

${$}DESCRIPTION${e}
       Change the current directory to ${t}dir${e}. With no arguments, changes
       to the home directory (/home/user).

       ${$}cd -${e}   change to previous directory (OLDPWD)
       ${$}cd ..${e}  change to parent directory
`,echo:`${$}ECHO(1)${e}                   tabcomputer Manual                  ${$}ECHO(1)${e}

${$}NAME${e}
       echo - display a line of text

${$}SYNOPSIS${e}
       ${$}echo${e} [${t}OPTION${e}]... [${t}STRING${e}]...

${$}DESCRIPTION${e}
       Echo the STRING(s) to standard output.

       ${$}-n${e}     do not output the trailing newline
       ${$}-e${e}     enable interpretation of backslash escapes
       ${$}-E${e}     disable interpretation of backslash escapes (default)

${$}ESCAPE SEQUENCES${e}
       \\n     new line
       \\t     horizontal tab
       \\\\     backslash
       \\0nnn  octal value
`,cp:`${$}CP(1)${e}                     tabcomputer Manual                    ${$}CP(1)${e}

${$}NAME${e}
       cp - copy files and directories

${$}SYNOPSIS${e}
       ${$}cp${e} [${t}OPTION${e}]... ${t}SOURCE${e} ${t}DEST${e}

${$}DESCRIPTION${e}
       Copy SOURCE to DEST, or multiple SOURCE(s) to DIRECTORY.

       ${$}-r${e}, ${$}-R${e}
              copy directories recursively

       ${$}-f${e}     force overwrite
`,mv:`${$}MV(1)${e}                     tabcomputer Manual                    ${$}MV(1)${e}

${$}NAME${e}
       mv - move (rename) files

${$}SYNOPSIS${e}
       ${$}mv${e} [${t}OPTION${e}]... ${t}SOURCE${e} ${t}DEST${e}

${$}DESCRIPTION${e}
       Rename SOURCE to DEST, or move SOURCE(s) to DIRECTORY.

       ${$}-f${e}     do not prompt before overwriting
`,rm:`${$}RM(1)${e}                     tabcomputer Manual                    ${$}RM(1)${e}

${$}NAME${e}
       rm - remove files or directories

${$}SYNOPSIS${e}
       ${$}rm${e} [${t}OPTION${e}]... [${t}FILE${e}]...

${$}DESCRIPTION${e}
       Remove (unlink) the FILE(s).

       ${$}-f${e}     ignore nonexistent files, never prompt
       ${$}-r${e}, ${$}-R${e}
              remove directories and their contents recursively
`,mkdir:`${$}MKDIR(1)${e}                  tabcomputer Manual                ${$}MKDIR(1)${e}

${$}NAME${e}
       mkdir - make directories

${$}SYNOPSIS${e}
       ${$}mkdir${e} [${t}OPTION${e}]... ${t}DIRECTORY${e}...

${$}DESCRIPTION${e}
       Create the DIRECTORY(ies), if they do not already exist.

       ${$}-p${e}     make parent directories as needed
`,head:`${$}HEAD(1)${e}                   tabcomputer Manual                  ${$}HEAD(1)${e}

${$}NAME${e}
       head - output the first part of files

${$}SYNOPSIS${e}
       ${$}head${e} [${t}OPTION${e}]... [${t}FILE${e}]...

${$}DESCRIPTION${e}
       Print the first 10 lines of each FILE to standard output.

       ${$}-n${e} ${t}NUM${e}
              print the first NUM lines instead of 10

       ${$}-c${e} ${t}NUM${e}
              print the first NUM bytes
`,tail:`${$}TAIL(1)${e}                   tabcomputer Manual                  ${$}TAIL(1)${e}

${$}NAME${e}
       tail - output the last part of files

${$}SYNOPSIS${e}
       ${$}tail${e} [${t}OPTION${e}]... [${t}FILE${e}]...

${$}DESCRIPTION${e}
       Print the last 10 lines of each FILE to standard output.

       ${$}-n${e} ${t}NUM${e}
              output the last NUM lines instead of 10

       ${$}-c${e} ${t}NUM${e}
              output the last NUM bytes

       ${$}-f${e}     output appended data as the file grows
`,wc:`${$}WC(1)${e}                     tabcomputer Manual                    ${$}WC(1)${e}

${$}NAME${e}
       wc - print newline, word, and byte counts

${$}SYNOPSIS${e}
       ${$}wc${e} [${t}OPTION${e}]... [${t}FILE${e}]...

${$}DESCRIPTION${e}
       Print newline, word, and byte counts for each FILE.

       ${$}-l${e}     print the newline counts
       ${$}-w${e}     print the word counts
       ${$}-c${e}     print the byte counts
       ${$}-m${e}     print the character counts
`,sort:`${$}SORT(1)${e}                   tabcomputer Manual                  ${$}SORT(1)${e}

${$}NAME${e}
       sort - sort lines of text files

${$}SYNOPSIS${e}
       ${$}sort${e} [${t}OPTION${e}]... [${t}FILE${e}]...

${$}DESCRIPTION${e}
       Write sorted concatenation of all FILE(s) to standard output.

       ${$}-r${e}     reverse the result of comparisons
       ${$}-n${e}     compare according to string numerical value
       ${$}-u${e}     output only unique lines
       ${$}-k${e} ${t}POS${e}
              sort via a key starting at POS
       ${$}-t${e} ${t}SEP${e}
              use SEP as the field separator
`,uniq:`${$}UNIQ(1)${e}                   tabcomputer Manual                  ${$}UNIQ(1)${e}

${$}NAME${e}
       uniq - report or omit repeated lines

${$}SYNOPSIS${e}
       ${$}uniq${e} [${t}OPTION${e}]... [${t}INPUT${e} [${t}OUTPUT${e}]]

${$}DESCRIPTION${e}
       Filter adjacent matching lines from INPUT, writing to OUTPUT.

       ${$}-c${e}     prefix lines by the number of occurrences
       ${$}-d${e}     only print duplicate lines
       ${$}-u${e}     only print unique lines
       ${$}-i${e}     ignore differences in case
`,chmod:`${$}CHMOD(1)${e}                  tabcomputer Manual                ${$}CHMOD(1)${e}

${$}NAME${e}
       chmod - change file mode bits

${$}SYNOPSIS${e}
       ${$}chmod${e} [${t}OPTION${e}]... ${t}MODE${e} ${t}FILE${e}...

${$}DESCRIPTION${e}
       Change the file mode (permissions) of each FILE.

       ${$}-R${e}     change files and directories recursively

${$}MODE${e}
       Octal (e.g. 755) or symbolic (e.g. u+x, go-w).
`,curl:`${$}CURL(1)${e}                   tabcomputer Manual                  ${$}CURL(1)${e}

${$}NAME${e}
       curl - transfer a URL

${$}SYNOPSIS${e}
       ${$}curl${e} [${t}OPTION${e}]... ${t}URL${e}

${$}DESCRIPTION${e}
       Transfer data from or to a server using HTTP/HTTPS.

       ${$}-o${e} ${t}file${e}
              write output to file instead of stdout

       ${$}-s${e}     silent mode

       ${$}-H${e} ${t}header${e}
              pass custom header (e.g. "Authorization: Bearer token")

       ${$}-X${e} ${t}method${e}
              specify request method (GET, POST, PUT, DELETE)

       ${$}-d${e} ${t}data${e}
              send data in POST request body

${$}EXAMPLES${e}
       curl https://api.example.com/data
              Fetch URL content

       curl -X POST -d '{"key":"val"}' -H "Content-Type: application/json" url
              POST JSON data
`,git:`${$}GIT(1)${e}                    tabcomputer Manual                   ${$}GIT(1)${e}

${$}NAME${e}
       git - distributed version control system

${$}SYNOPSIS${e}
       ${$}git${e} ${t}command${e} [${t}args${e}]

${$}DESCRIPTION${e}
       Git is a version control system for tracking changes in files.
       tabcomputer implements a subset of git commands using isomorphic-git.

${$}COMMANDS${e}
       ${$}init${e}       Create an empty git repository
       ${$}clone${e}      Clone a repository
       ${$}add${e}        Add file contents to the index
       ${$}commit${e}     Record changes to the repository
       ${$}status${e}     Show the working tree status
       ${$}log${e}        Show commit logs
       ${$}diff${e}       Show changes between commits
       ${$}branch${e}     List, create, or delete branches
       ${$}checkout${e}   Switch branches
       ${$}push${e}       Update remote refs
       ${$}pull${e}       Fetch and integrate with remote
`,vi:`${$}VI(1)${e}                     tabcomputer Manual                    ${$}VI(1)${e}

${$}NAME${e}
       vi - screen-oriented text editor

${$}SYNOPSIS${e}
       ${$}vi${e} [${t}file${e}]

${$}DESCRIPTION${e}
       Visual text editor with modal editing (normal, insert, command modes).

${$}NORMAL MODE${e}
       ${$}i${e}      enter insert mode
       ${$}a${e}      append after cursor
       ${$}o${e}      open new line below
       ${$}dd${e}     delete line
       ${$}yy${e}     yank (copy) line
       ${$}p${e}      paste
       ${$}u${e}      undo
       ${$}/${e}      search forward
       ${$}:w${e}     save
       ${$}:q${e}     quit
       ${$}:wq${e}    save and quit
`,less:`${$}LESS(1)${e}                   tabcomputer Manual                  ${$}LESS(1)${e}

${$}NAME${e}
       less - view file contents with pagination

${$}SYNOPSIS${e}
       ${$}less${e} [${t}OPTION${e}]... [${t}FILE${e}]

${$}DESCRIPTION${e}
       Less is a pager: it displays text one screenful at a time.

       ${$}-N${e}     show line numbers
       ${$}-R${e}     pass ANSI color codes through
       ${$}-S${e}     chop long lines instead of wrapping
       ${$}-F${e}     quit if content fits on one screen

${$}KEYS${e}
       ${$}q${e}          quit
       ${$}j${e}/↓        scroll down one line
       ${$}k${e}/↑        scroll up one line
       ${$}Space${e}/f    page down
       ${$}b${e}          page up
       ${$}g${e}          go to top
       ${$}G${e}          go to bottom
       ${$}/${e}${t}pattern${e}  search forward
       ${$}n${e}          next search match
       ${$}N${e}          previous search match
`,speak:`${$}SPEAK(1)${e}                  tabcomputer Manual                ${$}SPEAK(1)${e}

${$}NAME${e}
       speak - text-to-speech via browser SpeechSynthesis

${$}SYNOPSIS${e}
       ${$}speak${e} [${t}OPTION${e}]... [${t}TEXT${e}]

${$}DESCRIPTION${e}
       Convert text to speech using the browser's SpeechSynthesis API.
       Text can be provided as arguments or piped via stdin.

       ${$}--list${e}
              list available voices

       ${$}--stop${e}
              cancel any ongoing speech

       ${$}-r${e} ${t}rate${e}
              speech rate (0.1-10, default 1)

       ${$}-p${e} ${t}pitch${e}
              speech pitch (0-2, default 1)

       ${$}-v${e} ${t}voice${e}
              select voice by name (partial match)

${$}EXAMPLES${e}
       echo "Hello world" | speak
       speak -r 1.5 "Fast speech"
       speak --list
`,listen:`${$}LISTEN(1)${e}                 tabcomputer Manual              ${$}LISTEN(1)${e}

${$}NAME${e}
       listen - speech-to-text via browser SpeechRecognition

${$}SYNOPSIS${e}
       ${$}listen${e} [${t}OPTION${e}]...

${$}DESCRIPTION${e}
       Capture spoken words and output as text. By default, captures a
       single utterance and exits. Output goes to stdout for piping.

       ${$}-c${e}     continuous mode (keep listening until Ctrl+C)

       ${$}-t${e} ${t}secs${e}
              timeout after N seconds

       ${$}-l${e} ${t}lang${e}
              language code (default: en-US)

${$}EXAMPLES${e}
       listen | sh              speak a command to execute it
       listen -c >> notes.txt   dictate continuously to a file
       listen -t 5              listen for 5 seconds
`,camera:`${$}CAMERA(1)${e}                 tabcomputer Manual              ${$}CAMERA(1)${e}

${$}NAME${e}
       camera - take a webcam snapshot

${$}SYNOPSIS${e}
       ${$}camera${e} [${t}OPTION${e}]...

${$}DESCRIPTION${e}
       Capture a photo from the webcam and save as PNG to the filesystem.
       Prints the saved file path to stdout.

       ${$}-o${e} ${t}file${e}
              output file path (default: camera-TIMESTAMP.png)

${$}EXAMPLES${e}
       camera                         snapshot with auto-named file
       camera -o selfie.png           save to specific file
       camera -o pic.png && img pic.png  capture and display
`,notify:`${$}NOTIFY(1)${e}                 tabcomputer Manual              ${$}NOTIFY(1)${e}

${$}NAME${e}
       notify - send a browser notification

${$}SYNOPSIS${e}
       ${$}notify${e} [${t}OPTION${e}]... [${t}MESSAGE${e}]

${$}DESCRIPTION${e}
       Send a desktop notification using the browser Notification API.
       Requests permission automatically on first use.

       ${$}-t${e} ${t}title${e}
              notification title (default: "tabcomputer")

${$}EXAMPLES${e}
       notify "Build complete"
       notify -t "Alert" "Something happened"
       echo "Done" | notify
       build && notify "Finished"
`,top:`${$}TOP(1)${e}                    tabcomputer Manual                   ${$}TOP(1)${e}

${$}NAME${e}
       top - real-time process monitor

${$}SYNOPSIS${e}
       ${$}top${e} [${t}OPTION${e}]...

${$}DESCRIPTION${e}
       Display a live, updating view of running processes. Shows system
       uptime, task counts, memory usage, and per-process details.

       ${$}-d${e} ${t}secs${e}
              refresh delay in seconds (default: 2)

       ${$}-b${e}     batch mode (non-interactive, output to stdout)

       ${$}-n${e} ${t}num${e}
              number of iterations (batch mode)

${$}INTERACTIVE KEYS${e}
       ${$}q${e}          quit
       ${$}k${e}          kill process (prompts for PID)
       ${$}Space${e}      force refresh
`,factor:`${$}FACTOR(1)${e}                 tabcomputer Manual                ${$}FACTOR(1)${e}

${$}NAME${e}
       factor - print prime factors of numbers

${$}SYNOPSIS${e}
       ${$}factor${e} [${t}NUMBER${e}]...

${$}DESCRIPTION${e}
       Print the prime factors of each NUMBER. Numbers may be specified as
       arguments or read from stdin (one per line).

${$}EXAMPLES${e}
       factor 12
              12: 2 2 3

       factor 17
              17: 17

       echo 100 | factor
              100: 2 2 5 5
`,cksum:`${$}CKSUM(1)${e}                  tabcomputer Manual                ${$}CKSUM(1)${e}

${$}NAME${e}
       cksum - print CRC checksum and byte count

${$}SYNOPSIS${e}
       ${$}cksum${e} [${t}FILE${e}]...

${$}DESCRIPTION${e}
       Print POSIX CRC32 checksum and byte count for each FILE.
       With no FILE, read standard input.

       Output format: CRC BYTES [FILENAME]

${$}EXAMPLES${e}
       cksum file.txt
              4294967295 0 file.txt

       echo "hello" | cksum
              3287646509 6
`,base32:`${$}BASE32(1)${e}                 tabcomputer Manual                ${$}BASE32(1)${e}

${$}NAME${e}
       base32 - RFC 4648 Base32 encode or decode

${$}SYNOPSIS${e}
       ${$}base32${e} [${t}OPTION${e}]... [${t}FILE${e}]

${$}DESCRIPTION${e}
       Encode or decode FILE, or standard input, to/from Base32.

       ${$}-d${e}     decode data

       ${$}-w${e} ${t}COLS${e}
              wrap encoded lines at COLS (default 76, 0 to disable)

       ${$}-i${e}     when decoding, ignore non-alphabet characters

${$}EXAMPLES${e}
       echo -n "foo" | base32
              MZXW6===

       echo "MZXW6===" | base32 -d
              foo
`,numfmt:`${$}NUMFMT(1)${e}                 tabcomputer Manual                ${$}NUMFMT(1)${e}

${$}NAME${e}
       numfmt - convert numbers from/to human-readable strings

${$}SYNOPSIS${e}
       ${$}numfmt${e} [${t}OPTION${e}]... [${t}NUMBER${e}]...

${$}DESCRIPTION${e}
       Reformat NUMBER(s), or numbers from stdin, to/from human-readable.

       ${$}--from${e}=${t}UNIT${e}
              auto-scale input: none, auto, si, iec, iec-i

       ${$}--to${e}=${t}UNIT${e}
              auto-scale output: none, si, iec, iec-i

       ${$}--format${e}=${t}FMT${e}
              use printf-style format (e.g. %.2f)

       ${$}--padding${e}=${t}N${e}
              pad output to N characters

       ${$}--round${e}=${t}METHOD${e}
              rounding: up, down, from-zero, towards-zero, nearest

       ${$}--header${e}[=${t}N${e}]
              pass first N lines through (default 1)

${$}UNITS${e}
       si:    K=1000, M=10^6, G=10^9, T=10^12
       iec:   K=1024, M=2^20, G=2^30, T=2^40
       iec-i: Ki=1024, Mi=2^20, Gi=2^30

${$}EXAMPLES${e}
       numfmt --to=si 1000
              1.0K

       numfmt --to=iec 1048576
              1.0M

       numfmt --from=si 1K
              1000
`,csplit:`${$}CSPLIT(1)${e}                 tabcomputer Manual                ${$}CSPLIT(1)${e}

${$}NAME${e}
       csplit - split a file into sections by context

${$}SYNOPSIS${e}
       ${$}csplit${e} [${t}OPTION${e}]... ${t}FILE${e} ${t}PATTERN${e}...

${$}DESCRIPTION${e}
       Split FILE into pieces based on PATTERN(s). Outputs byte counts
       for each piece (unless -s). Pieces are written as xx00, xx01, etc.

       ${$}-f${e} ${t}PREFIX${e}
              use PREFIX instead of 'xx'

       ${$}-n${e} ${t}DIGITS${e}
              use specified number of digits (default 2)

       ${$}-s${e}     do not print counts of output file sizes

       ${$}-z${e}     remove empty output files

${$}PATTERNS${e}
       ${$}/regexp/${e}     split before lines matching regexp
       ${$}%regexp%${e}     skip to line matching regexp (discard)
       ${$}N${e}            split at line number N
       ${$}{N}${e}          repeat previous pattern N times
       ${$}{*}${e}          repeat previous pattern as many times as possible

${$}EXAMPLES${e}
       csplit file.txt 5
              Split at line 5

       csplit file.txt '/^Chapter/' '{*}'
              Split before each "Chapter" heading
`,spirit:`${$}SPIRIT(1)${e}                 tabcomputer Manual                  ${$}SPIRIT(1)${e}

${$}NAME${e}
       spirit - AI assistant powered by Claude

${$}SYNOPSIS${e}
       ${$}spirit${e} [${t}options${e}] [${t}prompt${e}]
       ${t}command${e} | ${$}spirit${e} [${t}options${e}] [${t}prompt${e}]

${$}DESCRIPTION${e}
       Sends a prompt to the Claude API and streams the response to stdout.
       When stdin is piped, the input data is included in the message.

       Requires ${$}ANTHROPIC_API_KEY${e} environment variable to be set.

${$}OPTIONS${e}
       ${$}--model${e} ${t}MODEL${e}
              Model to use (default: claude-sonnet-4-20250514)

       ${$}--system${e} ${t}PROMPT${e}
              Set a system prompt

       ${$}--max-tokens${e} ${t}N${e}
              Maximum tokens in response (default: 4096)

       ${$}--list-models${e}
              List available models and exit

       ${$}-h${e}, ${$}--help${e}
              Show usage information

${$}EXAMPLES${e}
       spirit "explain how DNS works"
              Ask a question

       cat data.csv | spirit "summarize this"
              Pipe data through AI

       spirit --model claude-opus-4-20250514 "review this" < code.js
              Use a specific model

       spirit --system "You are a bash expert" "find large files"
              Set a system prompt
`};function f(a,i){return`${$}${a.toUpperCase()}(1)${e}${" ".repeat(Math.max(1,27-a.length))}tabcomputer Manual${" ".repeat(Math.max(1,27-a.length))}${$}${a.toUpperCase()}(1)${e}

${$}NAME${e}
       ${a} - ${i}

${$}SYNOPSIS${e}
       ${$}${a}${e} [${t}args${e}]...

${$}DESCRIPTION${e}
       ${i}

       Run "${$}${a} --help${e}" for usage information.
`}const h={name:"man",description:"Manual pages",async exec(a){const{flags:i,positional:r}=u(a.args);if(i.k){const n=r.join(" ").toLowerCase();if(!n)return a.stderr+=`man -k: what manual page do you want?
`,1;const o=a.shell.commands?.list?.()||[];let p=!1;for(const c of o)(c.name.includes(n)||c.description.toLowerCase().includes(n))&&(a.stdout+=`${c.name}(1) - ${c.description}
`,p=!0);return p?0:(a.stderr+=`${n}: nothing appropriate
`,1)}if(i.f){for(const n of r){const o=a.shell.commands?.get?.(n);o?a.stdout+=`${o.name}(1) - ${o.description}
`:a.stderr+=`${n}: nothing appropriate
`}return r.length>0?0:1}if(r.length===0)return a.stderr+=`What manual page do you want?
Usage: man [command]
`,1;const l=r[r.length-1];let s=m[l];if(!s){const n=a.shell.commands?.get?.(l);if(n)s=f(n.name,n.description);else return a.stderr+=`No manual entry for ${l}
`,1}if(a.terminal){const n=a.shell.commands?.get?.("less");if(n){const o={args:["-R"],fs:a.fs,cwd:a.cwd,env:a.env,stdin:s,stdout:"",stderr:"",shell:a.shell,terminal:a.terminal};return n.exec(o)}}return a.stdout+=s,s.endsWith(`
`)||(a.stdout+=`
`),0}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/man.ts",d);export{h as manCmd};
