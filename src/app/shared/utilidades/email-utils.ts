// email-utils.ts

import { Iemail } from "app/shared/models/Iemail";
import { EmailService } from "app/shared/services/email.service";

export class emailUtils{
    constructor( private EmailService : EmailService){}

     public constructEmail(accionesresult: string, hayComentarios: boolean, demandaDescripcion: string): Iemail | null {
        let action: string;
        let body: string;
        enum actions{
         comentar = "comentar",
         editar = "editar"
        }
        const options = [
            
        ]
 /*   
        if (accionesresult === "creado") {
            action = 'creado';
            body = `Se ha creado una nueva demanda: ${demandaDescripcion}`;
        } 
        
        if (accionesresult === "modificado" && hayComentarios) {
            action = 'modificado';
            body = `Se ha añadido un comentario a la demanda ${demandaDescripcion}`;
        } 
        
        if (accionesresult === "modificado" && !hayComentarios) {
            action = 'modificado';
            body = `Se ha hecho una modifición en la demanda: ${demandaDescripcion}`;
        } 
        
        if (accionesresult === "borrado") {
            action = 'eliminado';
            body = `Se ha eliminado la demanda: ${demandaDescripcion}`;
        }
    */
        return {
            ToEmail: 'rensomiguel3@gmail.com',
            Subject: `Se ha ${action} una demanda "${demandaDescripcion}"`,
            Body: body,
            Attachments: []
        };
    }
    
    public notifyClientByEmail(datos: Iemail): void {
        this.EmailService.createEmail(datos)
            .subscribe(
                (response) => {
                    console.log('Correo enviado con éxito:', response);
                },
                (error) => {
                    console.error('Error al enviar el correo:', error);
                }
            );
    }
    
}

export default emailUtils;
