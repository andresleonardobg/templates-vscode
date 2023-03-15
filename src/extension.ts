import * as vscode from 'vscode';
import * as fs from 'fs';
import * as pathh from 'path';
import { performance } from 'perf_hooks';

const listOfTemplates : vscode.QuickPickItem[] = [
	{label: 'templateOne'},
	{label: 'templateTwo'},
	{label: 'templateThree'},
	{label: 'templateFour'}
];

//functions
//copy template
async function copyFile(
	vscode : any,
	context : any,
	outputChannel : any,
	sourcePath : String,
	destPath : String,
	callBack : Function
  ): Promise<void> {
	try {
	  const wsedit = new vscode.WorkspaceEdit();
	  const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
	  const data = await vscode.workspace.fs.readFile(
		vscode.Uri.file(context.asAbsolutePath(sourcePath))
	  );
	  const filePath = vscode.Uri.file(wsPath + destPath);
	  wsedit.createFile(filePath, { ignoreIfExists: true });
	  await vscode.workspace.fs.writeFile(filePath, data);
	  let isDone = await vscode.workspace.applyEdit(wsedit);
	  if(isDone) {
		outputChannel.appendLine(`File created successfully: ${destPath}`);
		callBack(null, true);
	  }
	} catch (err) {
	  outputChannel.appendLine(`ERROR: ${err}`);
	  callBack(err, false);
	  console.log(err);
	}
  }


//get all folders
function getDirectories (path : string) {
	return fs.readdirSync(path as fs.PathLike)
	  .filter(file => fs.statSync(pathh.join(path, file)).isDirectory());
  }
  
function getAllDirectories(dirPath : string, arrayOfDirectories : Array<string>) {
	const directories = getDirectories(dirPath);
	arrayOfDirectories = arrayOfDirectories || [];

	directories.forEach(directory => {
		const newDirPath = pathh.join(dirPath, directory);
		arrayOfDirectories.push(newDirPath);
		getAllDirectories(newDirPath, arrayOfDirectories);
	});

	return arrayOfDirectories;
}

function listOfFolders(path : string){
	//this functios delete de current path of every item
	let list : String[] = getAllDirectories(path, []);
	let newList : vscode.QuickPickItem[] = [];
	list.forEach((element) => {
		let e = element.replace(/\\/g, '/');
		newList.push( { label: e.replace(path, '') } );
	});

	newList.push({ label:'sin carpeta destino'});

	return newList;
}

async function openFile( template : string, texto : string ){;

	const files = await vscode.workspace.findFiles(`**/${ template + texto + ".mjml"}`);
	const document = await vscode.workspace.openTextDocument(files[files.length - 1]);
	await vscode.window.showTextDocument(document);

	let startTime = performance.now();

	vscode.commands.executeCommand('mjml.previewToSide');

	var endTime = performance.now();

	console.log(`Tiempo tomado para ver las carpetas ${endTime - startTime} milisegundos`);

}

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "test" is now active!');

	let testChannel = vscode.window.createOutputChannel("TestChannel");
	
	const disposable = vscode.commands.registerCommand('test.templates', async () => {
		
		let dest : string;
		const path = vscode.workspace.workspaceFolders![0].uri.path;

		let startTime = performance.now();

		let foldersCurrtentWorkspace : vscode.QuickPickItem[] = listOfFolders(path.substring(1));

		var endTime = performance.now();

		console.log(`Tiempo tomado para ver las carpetas ${endTime - startTime} milisegundos`);
		
		//pick folder	
		const selectFolder = await vscode.window.showQuickPick(foldersCurrtentWorkspace, {placeHolder: 'Selecciona la capeta destino'});

		let template : any;
		let texto : any;

		//pick template
		if(selectFolder !== undefined){
			template = await vscode.window.showQuickPick(listOfTemplates,{placeHolder: 'Seleccione la plantilla'});
			if(template !== undefined){
				//put some text at the end of name		
					texto = await vscode.window.showInputBox({
						placeHolder: 'dia del mail'
				});
			}
		} 

		

		if (selectFolder !== undefined && template !== undefined && texto !== undefined) {
			
			if (selectFolder!.label === 'sin carpeta destino') {
				dest = "/" + template!.label + texto + ".mjml";
			}else{
				dest = selectFolder!.label + "/" + template!.label + texto + ".mjml";
			}
			
			copyFile(vscode, context, testChannel, '/templates/' + template!.label + '.mjml', dest, function(err : any, res : any) {});

			openFile(template.label, texto);	
				
			// Display a message box to the user
			vscode.window.showInformationMessage(template!.label + " creado");
			
		}

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
