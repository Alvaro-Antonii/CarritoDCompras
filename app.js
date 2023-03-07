//Espere que el DOM sea cargadoo
document.addEventListener('DOMContentLoaded',e =>{
    fetchData();
})

const fetchData = async () =>{
    try {
        const resp = await fetch("api.json");
        const data = await resp.json();
        
        pintar(data);
        detBotones(data);
        
    } catch (error) {
        console.log(error)
    }
    
}


const contenedorPro = document.querySelector("#contenedor-productos");

const pintar = data =>{
    const template = document.querySelector("#template-productos").content;
    const fragment = document.createDocumentFragment();
    //recorrer arreglo de objetos

    data.forEach(element => {
        template.querySelector("img").setAttribute("src",element.thumbnailUrl);
        template.querySelector("h5").textContent = element.title;
        template.querySelector("span").textContent = element.precio;
        template.querySelector("button").dataset.id = element.id;
        const clone = template.cloneNode(true)

        fragment.appendChild(clone)
    });
    contenedorPro.appendChild(fragment)
}



let arrayProducto ={};

const detBotones = (data) =>{
    const botones = document.querySelectorAll(".card button");
    botones.forEach(btn =>{
        btn.addEventListener('click',()=>{
            const producto = data.find( e => e.id === parseInt(btn.dataset.id));
            producto.cantidad = 1;

            if(arrayProducto.hasOwnProperty(producto.id)){
               producto.cantidad = arrayProducto[producto.id].cantidad + 1;
            }

            arrayProducto[producto.id] = {...producto};
            

            pintarCarrito();

            })
    })
    
}
///////////////////////////////////////////////////////////////////

const contenedorCarrito = document.querySelector("#items");


const pintarCarrito = () =>{
    contenedorCarrito.innerHTML="";
    const carrito = document.querySelector("#template-carrito").content;
    const fragment = document.createDocumentFragment();

    
    Object.values(arrayProducto).forEach( producto =>{
        
        // carrito.querySelector("th").textContent = producto.id;
        carrito.querySelector("img").setAttribute("src",producto.thumbnailUrl);
        carrito.querySelectorAll("td")[0].textContent = producto.title;
        carrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        carrito.querySelectorAll("td")[3].textContent = producto.precio*producto.cantidad;
        carrito.querySelector(".btn-info").dataset.id = producto.id;
        carrito.querySelector(".btn-danger").dataset.id = producto.id;

        const clone = carrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    contenedorCarrito.appendChild(fragment);
    botMas();
    mensajeFooter();
}

//////////////////Footer////////////////////////
const footer = document.querySelector("#footer"); 

const mensajeFooter = () =>{
    footer.innerHTML=""

    if(Object.values(arrayProducto).length === 0){
        footer.innerHTML = ` <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }


    const template = document.querySelector("#template-footer").content;
    const fragment = document.createDocumentFragment();
    let cantidad = 0
    let total = 0
    Object.values(arrayProducto).forEach(e=>{
        cantidad = cantidad + e.cantidad;
        total = total + (e.cantidad*e.precio)
    })

    template.querySelectorAll("td")[0].textContent = cantidad;
    template.querySelector("span").textContent = total;
    
    

    const clone = template.cloneNode(true)
    fragment.appendChild(clone);
    footer.appendChild(fragment);
   
    const boton = document.querySelector("#vaciar-carrito")
    boton.addEventListener("click", () =>{
        arrayProducto = {}
        
        pintarCarrito()
    })

}



//////////////Botones de carrito////////////////////////////////////

const botMas = () =>{
    const botMas = document.querySelectorAll(".btn-info")
    const botMenos = document.querySelectorAll(".btn-danger")
    if(Object.values(arrayProducto).length === 0){
        arrayProducto = {}
        
        
    }
    botMas.forEach(btn=>{
        btn.addEventListener("click", () =>{
            
            const producto = arrayProducto[btn.dataset.id]
            producto.cantidad ++
            arrayProducto[btn.dataset.id] = {...producto}
            pintarCarrito()
        })
    })
    botMenos.forEach(btn=>{
        btn.addEventListener("click", () =>{
            const producto = arrayProducto[btn.dataset.id]
            producto.cantidad --
            if(producto.cantidad === 0){
                delete arrayProducto[btn.dataset.id]
                
            } else{
                arrayProducto[btn.dataset.id] = {...producto}
                
            }
            pintarCarrito()
           
        })
    })

    
}

//////////////Mostrar carrito//////////////

const mostCarro = document.querySelector(".botCarrito")
const vistaCarro = document.querySelector(".carrito")
mostCarro.addEventListener("click",()=>{
    vistaCarro.style.display = "flex"
})

/////////////////Cerrar carrito///////////////////

const butCerrar = document.querySelector(".butonCerrar")

butCerrar.addEventListener("click",()=>{
    vistaCarro.style.display = "none"
})