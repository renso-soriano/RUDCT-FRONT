import Swal, { SweetAlertIcon } from 'sweetalert2'
export class SweetAlert {
  async AlertConfirm(
    Title: string,
    Text: string,
    TypeSuccessErrorOrWarning: SweetAlertIcon
  ): Promise<boolean> {
    const a = await Swal.fire({
      title: Title,
      text: Text,
      icon: TypeSuccessErrorOrWarning,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    })
    return a.isConfirmed
  }

  Default(
    Title: string,
    Text: string,
    TypeSuccessErrorOrWarning: string
  ): void {
    Swal.fire(Title, Text, 'success')
  }
}
