export function formatPhoneNumber(text: string) {
  var cleaned = ('' + text).replace(/\D/g, '')
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    var intlCode = (match[1] ? '+1 ' : '')
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return null
}
export function formatEmail(test:string) {
  return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(test)) ? test : null
}

export function formatPassword(text:string) {
  return text.length > 4 ? test : null
}

export function formatDisplayName(text: string) {
  return text.replace(/[|/&;$%@"<>()+,]/g, '')
}