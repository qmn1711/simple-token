export const shortEthAddress = (address: string) => {
  if (!address) return address

  return address.replace(address.slice(5, address.length - 4), '...')
}
