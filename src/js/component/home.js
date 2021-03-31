import React, { useState, useEffect } from "react";

//create your first component-
export function Home() {
	//Declaración de Hooks del componente-
	const [tasklist, setTaskList] = useState([]);
	const [task, setTask] = useState("");
	const [hoverli, setHoverli] = useState(false);

	//Al iniciar consulta las tareas del usuario-
	useEffect(() => {
		getTaskList();
	}, []); //-> Se ejecuta solo al iniciar

	//Función para obtener lista de tareas de la DB y asignarla al hook >tasklist<-
	const getTaskList = () => {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		var requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow"
		};

		fetch(
			"https://assets.breatheco.de/apis/fake/todos/user/davidgq",
			requestOptions
		)
			.then(response => response.json())
			.then(result => setTaskList(result))
			.catch(error => console.log("error", error));
	};

	//Evento que se genera al presionar la tecla "Enter" del input newtask
	const handleOnKeyPress = e => {
		//Verifica si la tecla presionada es Enter e Input Not Null, agrega elemento a lista de tareas
		if (e.key === "Enter" && task !== "") {
			e.preventDefault();
			//define la newTask que será añadida al array
			const newTask = {
				label: task,
				done: false
			};

			//inserta el newTask al final del array

			const updateTaskList = [...tasklist].concat([newTask]);
			setTaskList(updateTaskList);
			console.log(
				"imprimiendo mi tasklist luego de la primer definición de adición",
				updateTaskList
			);
			//reinicia el valor de task
			setTask("");

			//llama a la función putTaskList que se encarga de actualizar la BD
			putTaskList(updateTaskList);
		} else if (e.key === "Enter" && task == "") {
			alert("Upps, you must enter a task");
		}
	};

	// función para actualizar las tareas de la DB cuando se agrega o elimina una tarea
	function putTaskList(updateTaskList) {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		//var raw = JSON.stringify(tasklist.concat(task));
		var raw = JSON.stringify(updateTaskList);

		var requestOptions = {
			method: "PUT",
			headers: myHeaders,
			body: raw,
			redirect: "follow"
		};

		fetch(
			"https://assets.breatheco.de/apis/fake/todos/user/davidgq",
			requestOptions
		) //luego de guardar sincroniza el tasklist de la DB
			.then(response => response.text())
			.then(result => console.log(result))
			.catch(error => console.log("error", error));
	}

	// función para eliminar task al dar click al button
	const handleOnClickDelete = id => {
		//se filtra el tasklist eliminando el elemento seleccionado
		const updateTaskList = [...tasklist].splice(id, 1);
		console.log(
			"imprimiendo mi clone-splice tasklist luego de la primer definición de remosión",
			updateTaskList
		);
		setTaskList(updateTaskList);

		//verifica si existe almenos una tarea en el tasklist
		if (tasklist.length > 0) {
			//llama a la función putTaskList que se encarga de actualizar la BD
			putTaskList(updateTaskList);
		} else {
			//llama a la función putTaskList que se encarga de actualizar la BD con la tarea default
			putTaskList(fakeTask);
		}
	};

	const generarLista = () => {
		//recorre el objeto y genera los elementos de la lista
		return tasklist.map((task, index) => {
			return (
				<li
					key={index}
					className="list-group-item"
					onMouseEnter={() => setHoverli(index)}>
					<p className="d-inline-block text-secondary ml-4 fs-3 align-middle rounded-0">
						{task.label}
					</p>
					{index == hoverli && task.done == false ? (
						<button
							type="button"
							className="btn btn-light float-right"
							onClick={() => handleOnClickDelete(index)}>
							<i className="fas fa-times"></i>
						</button>
					) : null}
				</li>
			);
		});
	};

	//Debido a que la API no permite recibir arrays vacíos, al eliminar todas las tareas se crea un elemento default.
	const fakeTask = [
		{
			label:
				"Congratulations, you have completed all your tasks!!! it's time to rest!!! ",
			done: true
		}
	];

	//genera el componente
	return (
		<div className="container mt-4">
			<h1 className="text-muted text-center display-4">Todos</h1>
			<div className="d-flex flex-row">
				<input
					type="text"
					placeholder="Type a new task"
					className="form-control text-secondary rounded-0"
					value={task}
					onChange={e => setTask(e.target.value)}
					onKeyPress={e => handleOnKeyPress(e)}
				/>
				<button
					className="btn btn-primary col-md-auto"
					onClick={putTaskList(fakeTask)}>
					Delete all
				</button>
			</div>
			{/*acá va la lisa de todos*/}
			<ul className="list-group">{generarLista()}</ul>
			<div>
				<label htmlFor="list-group-item">
					<p className="text-secondary ml-5 mt-4">
						<i>
							{tasklist.length == 0
								? "No tasks, add a task"
								: tasklist.length + " item left"}
						</i>
					</p>
				</label>
			</div>
		</div>
	);
}
