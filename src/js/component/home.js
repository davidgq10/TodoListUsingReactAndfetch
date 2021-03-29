import React, { useState, useEffect } from "react";

//create your first component
export function Home() {
	//Declaración de Hooks del componente
	const [tasklist, setTaskList] = useState([]);
	const [task, setTask] = useState("");
	const [hoverli, setHoverli] = useState(false);

	useEffect(() => {
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
			.then(response => response.text())
			.then(result => console.log(result))
			.catch(error => console.log("error", error));
	}, []); // Se ejecuta solo al iniciar

	//Evento que se genera al presionar una tecla del input newtask
	const handleOnKeyPress = e => {
		//Verifica si la tecla presionada es enter, true agrega elemento a lista de tareas
		if (e.key === "Enter" && task !== "") {
			e.preventDefault();
			//define la newTask que será añadida al array
			const newTask = {
				id: new Date().getTime(),
				description: task
			};
			//clona el tasklist actual y le añade la newTask
			setTaskList([...tasklist].concat(newTask));
			//reinicia el valor de task
			setTask("");
		} else if (e.key === "Enter" && task == "") {
			alert("Upps, you must enter a task");
		}
	};

	const generarLista = () => {
		//recorre el objeto y genera los elementos de la lista
		return tasklist.map(task => (
			<li
				key={task.id}
				className="list-group-item"
				onMouseEnter={() => setHoverli(task.id)}>
				<p className="d-inline-block text-secondary ml-4 fs-3 align-middle rounded-0">
					{task.description}
				</p>
				{task.id == hoverli ? (
					<button
						type="button"
						className="btn btn-light float-right"
						onClick={() => deleteTask(task.id)}>
						<i className="fas fa-times"></i>
					</button>
				) : null}
			</li>
		));
	};

	// función para eliminar task al dar click al button
	const deleteTask = id => {
		const updateTaskList = [...tasklist].filter(task => task.id !== id);
		setTaskList(updateTaskList);
	};

	//genera el componente
	return (
		<div className="container">
			<h1 className="text-muted text-center display-4">Todos</h1>
			<input
				type="text"
				placeholder="Type a new task"
				className="form-control text-secondary rounded-0"
				value={task}
				onChange={e => setTask(e.target.value)}
				onKeyPress={e => handleOnKeyPress(e)}
			/>
			<ul className="list-group">
				{generarLista()}
				<div>
					<label htmlFor="list-group-item">
						<p className="text-secondary ml-5 mt-2">
							{tasklist.length == 0
								? "No tasks, add a task"
								: tasklist.length + " item left"}
						</p>
					</label>
				</div>
			</ul>
		</div>
	);
}
