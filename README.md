# PAKETNIK :mailbox:
## RAZVOJ APLIKACIJ ZA INTERNET
Uporablja se samo back-end. <br>
Spletna (samo namizna) aplikacija za paketnik. <br>
Implementirana: 
  - nodeJS (express framework)
  - handlebars
  - MongoDB

### KAKO DELUJE :dizzy:

1. Uporabnik se prijavi
   - Registrira svoj paketnik z ID, ki ga je dobil ob nakupu nabiralnika
  
2. Uporabnik naroči
   - ob tem se enemu od dostavljalcev dodeli to naročilo
  
3. Dostavljalec ob prihodu na naslov "pozvoni" oz. pritisne gumb v aplikaciji.
   - prejemnik dobi na lahko odklene nabiralnik
  
4. Prejemnik odklene paketnik

5. Dostavljalec vstavi paket v paketnik
   - Ob tem se še preveri če izdelki ustrezajo tistim iz dejanskega naročila glede teže (paketnik ima tehnico vgrajeno) in črtne kode
  
### OSTALE FUNKCIJONALNOSTI
  - admin lahko registrira novega dostavljalca
  - admin se določi preko baze
  - admin lahko briše uporabnike ter spreminja iz navadnega uporabnika v dostavljalca


### RAZVIJALCA :godmode:
  - Ivan Jovanović
  - Tilen Pintarić
