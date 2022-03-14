const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const fs = require("fs");

// Disposicion de assets
app.use(express.static(__dirname + "/assets/Img"));

// Invocacion bootstrap
app.use(
	"/bootstrap",
	express.static(__dirname + "/node_modules/bootstrap/dist/css"),
);
app.use(
	"/BootstrapJs",
	express.static(__dirname + "/node_modules/bootstrap/dist/js/"),
);

// -------------------------------

// Configuracion de handlebars
app.set("view engine", "handlebars");

app.engine(
	// ! Primer parametro define la extension de los archivos que handlebars identificara como vistas.
	"handlebars",
	// ! Definimos la ruta del directorio desde donde se tomaran las vistas.
	exphbs.engine({
		layoutsDir: __dirname + "/views",
		// ! Ruta para los parciales/componentes
		partialsDir: __dirname + "/views/componentes/",
	}),
);

//-------------------------------

// Carga de la ruta principal
app.get("/", function (req, res) {
	// Carga de stocks
	const productos = JSON.parse(
		fs.readFileSync(__dirname + "/assets/Carrito/productos.json", "utf-8"),
	).productos;

	const carrito = JSON.parse(
		fs.readFileSync(
			__dirname + "/assets/Carrito/productosCarrito.json",
			"utf-8",
		),
	).carrito;

	console.log(carrito);
	console.log(productos);
	// Renderizado
	res.render("Inicio", {
		layout: "Inicio",
		productos: productos,
		carrito: carrito,
	});
});

// Agregar producto al carrito
app.get("/agregar/:item", function (req, res) {
	// Obtenemos el item a agregar sin el :
	const item = req.params.item.slice(1);

	// Modificacion del carrito
	const productosCarrito = JSON.parse(
		fs.readFileSync("./assets/Carrito/productosCarrito.json"),
	);

	productosCarrito.carrito.push(item);

	fs.writeFileSync(
		"./assets/Carrito/productosCarrito.json",
		JSON.stringify(productosCarrito),
	);

	res.redirect("/");
});

app.listen(3000, () => {
	console.log("Server started on port 3000");
});
