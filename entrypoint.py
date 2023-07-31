#!/usr/bin/env python3
import argparse
import os
import subprocess
import concurrent.futures
import sys
import threading
import time

if sys.version_info < (3, 9):
    print("Python 3.9 or newer is required")
    sys.exit(1)


def load_env() -> None:
    with open(".env", "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if line and not line.startswith("#"):
                key, value = line.split("=", 1)
                # remove quotes
                if (
                    len(value) >= 2
                    and value[0] in ("'", '"')
                    and value[-1] in ("'", '"')
                ):
                    value = value[1:-1]
                os.environ[key] = value


try:
    load_env()
except FileNotFoundError:
    print("No .env file found, skipping loading env variables")

GENERATE_CLIENT_API_COMMAND = """\
npx @openapitools/openapi-generator-cli generate \
-i ./openapi.json \
-g typescript-fetch \
-o ../frontend/src/pek-api \
--additional-properties=supportsES6=true
"""


def build_metal_command(items: list[str], install=False, validate=True):
    if "backend" in items or "openapi" in items:
        if install:
            execute_command("npm ci", cwd="backend")

        if "backend" in items:
            execute_command("npm run build", cwd="backend")
        if "openapi" in items:
            if validate:
                execute_command("npm run start:prod -- --validate-only", cwd="backend")
            execute_command(
                GENERATE_CLIENT_API_COMMAND,
                cwd="backend",
            )
    if "frontend" in items:
        if install:
            execute_command("npm ci", cwd="frontend")

        execute_command("npm run build", cwd="frontend")


def start_dev_command(items: list[str], do_init=False):
    if do_init:
        execute_command("npm install", cwd="backend")
        execute_command("npm install", cwd="frontend")

        build_metal_command(
            install=False,
            items=[
                item for item in items if item in ["backend", "frontend", "openapi"]
            ],
        )

    commands = []
    if "backend" in items:
        commands.append(
            lambda: execute_command("npm run start:dev", cwd="backend", verbose=True)
        )
    if "frontend" in items:
        commands.append(
            lambda: execute_command("npm run start", cwd="frontend", verbose=True)
        )
    if "openapi" in items:

        def watch_and_build():
            last_config = ""
            while True:
                with open("backend/openapi.json", "r", encoding="utf-8") as file:
                    if (the_config := file.read()) != last_config:
                        last_config = the_config
                        try:
                            build_metal_command(
                                install=False,
                                validate=False,
                                items=["openapi"],
                            )
                        # pylint: disable=W0718
                        except Exception as err:
                            print(err)
                time.sleep(1)

        threading.Thread(target=watch_and_build, daemon=True).start()
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(task) for task in commands]
        concurrent.futures.wait(futures)


# pylint: disable=R0903
class Commands:
    SHELL = "shell"
    DEV = "dev"
    BUILD = "build"
    METAL = "metal"


def main() -> None:
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command", required=True)

    # dev subcommand
    dev = subparsers.add_parser(Commands.DEV)
    dev.add_argument(
        "--init",
        action="store_true",
        help="install dependencies, build the project and apply migrations",
    )
    dev.add_argument(
        "--items",
        nargs="+",
        choices=["frontend", "backend", "openapi"],
        default=["frontend", "backend", "openapi"],
    )

    # shell subcommand
    shell = subparsers.add_parser(Commands.SHELL)
    shell.add_argument("--cwd", help="Working directory")
    shell.add_argument("rest", nargs="*")

    # build subcommand
    build = subparsers.add_parser(Commands.BUILD)
    build.add_argument("--install", action="store_true", help="Install dependencies")
    build.add_argument(
        "--no-validate",
        action="store_false",
        dest="validate",
        help="Don't validate the openapi spec",
    )
    build.add_argument(
        "--items",
        nargs="+",
        choices=["frontend", "backend", "openapi"],
        default=["frontend", "backend", "openapi"],
    )

    args = parser.parse_args()
    print(args)

    match args.command:
        case Commands.SHELL:
            execute_command(" ".join(args.rest), cwd=args.cwd, verbose=True)
        case Commands.DEV:
            start_dev_command(do_init=args.init, items=args.items)
        case Commands.BUILD:
            build_metal_command(
                install=args.install, validate=args.validate, items=args.items
            )


def execute_command(command: str, cwd="", verbose: bool | str = False):
    print(f" + {cwd}$ {command}")
    process = subprocess.Popen(
        command,
        cwd=cwd if cwd != "" else ".",
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True,
    )

    if verbose is True:
        tag = cwd + "$ "
    elif verbose is False:
        tag = "\t"
    elif verbose is None:
        tag = ""
    else:
        tag = verbose + "$ "

    while True:
        if stdout_line := process.stdout.readline() if process.stdout else "":
            sys.stdout.write(tag)
            sys.stdout.write(stdout_line if "\033[2J" not in stdout_line else "")
            sys.stdout.flush()
            continue

        if stderr_line := process.stderr.readline() if process.stderr else "":
            sys.stderr.write(tag)
            sys.stderr.write(stderr_line if "\033[2J" not in stderr_line else "")
            sys.stderr.flush()
            continue

        if process.poll() is not None:
            if process.returncode != 0:
                raise RuntimeError(
                    f"Command failed with exit code {process.returncode}"
                )
            return


if __name__ == "__main__":
    main()
