import os

def read_file(file_path):
    """Read and return the contents of a file."""
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def main():
    # Define the base path and file names
    base_path = r"C:\Users\Abdul Nafay\Abdul Nafay Stuff\vscode\sites\encrypters\aes-encrypter"
    files = ["index.html", "styles.css", "script.js"]

    # Read the contents of each file
    file_contents = {file: read_file(os.path.join(base_path, file)) for file in files}

    # Define the command
    command = "Please review and improve the following code to make it more professional. The files to be considered are index.html, styles.css, and script.js. try to make it towards a dark theme and donot add any comments"

    # Construct the text to be written
    text = command + "\n\n"
    for file, content in file_contents.items():
        text += f"--- {file} ---\n{content}\n\n"

    # Write the combined text to final.txt
    output_file = os.path.join(base_path, "final.txt")
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"Combined content has been written to {output_file}")

if __name__ == "__main__":
    main()