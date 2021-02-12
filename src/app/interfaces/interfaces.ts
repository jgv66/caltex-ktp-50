

// definicion de la interface de carrito

export interface Carrito {
    empresa: string;
    vendedor: string;
    bodega: string;
    sucursal: string;
    cliente: string;
    suc_cliente: string;
    codigo: string;
    descrip: string;
    cantidad: number;
    codigoimagen: string;
    saldo_ud1: number;
    precio: number;
    preciomayor: number;
    descuentomax: number;
    dsctovend: number;
    listapre: string;
    metodolista: string;
    concompras: number;
}

export interface Cliente {
    codigo: string;
    sucursal: string;
    razonsocial: string;
    direccion: string;
    ciudad: string;
    comuna: string;
    vendedor: string;
    nombrevendedor: string;
    listaprecios: string;
    nombrelista: string;
    email: string;
}
