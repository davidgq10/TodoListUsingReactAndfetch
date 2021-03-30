import React, { useState, useEffect } from "react";
import { func } from "prop-types";

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

	// función para actualizar las tareas de la DB
	function putTaskList() {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		var raw = JSON.stringify(tasklist);
		console.log("Imprimiendo mi JSON");
		console.log(raw);

		var requestOptions = {
			method: "PUT",
			headers: myHeaders,
			body: raw,
			redirect: "follow"
		};

		fetch(
			"https://assets.breatheco.de/apis/fake/todos/user/davidgq",
			requestOptions
		)
			.then(response => response.json())
			.then(result => console.log(result))
			.catch(error => console.log("error", error));
	}

	//Evento que se genera al presionar una tecla del input newtask
	const handleOnKeyPress = e => {
		//Verifica si la tecla presionada es enter, true agrega elemento a lista de tareas
		if (e.key === "Enter" && task !== "") {
			e.preventDefault();
			//define la newTask que será añadida al array
			redefinir();
			handlingAllPromises();
		} else if (e.key === "Enter" && task == "") {
			alert("Upps, you must enter a task");
		}
	};

	function handlingAllPromises() {
		putTaskList();
	}
	function redefinir() {
		return new Promise(() => {
			const newTask = {
				label: task,
				done: false
			};
			//clona el tasklist actual y le añade la newTask
			setTaskList([...tasklist].concat(newTask));
			console.log("imprimiendo el newtasklist", tasklist);
			//reinicia el valor de task
			setTask("");
		});
	}
	// function redefinir() {
	// 	const newTask = {
	// 		label: task,
	// 		done: false
	// 	};
	// 	//clona el tasklist actual y le añade la newTask
	// 	setTaskList([...tasklist].concat(newTask));
	// 	console.log("imprimiendo el newtasklist", tasklist);
	// 	//reinicia el valor de task
	// 	setTask("");
	// }

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
					{index == hoverli ? (
						<button
							type="button"
							className="btn btn-light float-right"
							onClick={() => deleteTask(index)}>
							<i className="fas fa-times"></i>
						</button>
					) : null}
				</li>
			);
		});
	};

	// función para eliminar task al dar click al button
	const deleteTask = id => {
		const updateTaskList = [...tasklist].filter(task => task.id !== id);
		setTaskList(updateTaskList);
		handlingAllPromises();
	};

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
				<button className="btn btn-primary col-md-auto">
					Delete all
				</button>
			</div>
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
