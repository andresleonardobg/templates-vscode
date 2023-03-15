# Extention to create custom templates
This is an example of a extension that I created in my last work to create mailings with [MJML](https://mjml.io/) more fast.

## Features
You can use a command in the command pallete of vscode in this case called **"Test: templates"** that show you some options, first you can pick up the folder in your workspace where you want to save the template, next choice the template what you want and finally write some text at the end of the template's name to diference it. 

![command](https://raw.githubusercontent.com/andresleonardobg/templates-vscode/main/assets/extension-command.gif)

After all this preceso the extention will create a new file with a preset related to the selected template.

Also you can use snippets to autocomplete some presets in the mail that you need.

For this example you can use this 

### Snippets
- testDobleColumna
- testBoton

![command](https://raw.githubusercontent.com/andresleonardobg/templates-vscode/main/assets/extension-snippets.gif)



## Requirements
- [VSCODE](https://code.visualstudio.com/)
- [MJML](https://marketplace.visualstudio.com/items?itemName=mjmlio.vscode-mjml) (extention to vscode)

## More information

[Your first extention](https://code.visualstudio.com/api/get-started/your-first-extension)

You can create a file **vsix** to share in vscode or your cowokers follow the eteps in the link below:

[Publishing extention](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)