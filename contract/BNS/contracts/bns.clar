
;; domain-registering
;; <contract for registering domains>

;; constants/errors
(define-constant ERR_MINT_FAILED (err u200))
(define-constant ERR_AUTH_FAILED (err u201))

;; data maps and vars
(define-map domain-data 
    {name: (string-ascii 128)}
    {data: (buff 512)}
)

;; defining non-fungible token for Amortize
(define-non-fungible-token AMORTIZE-DOMAIN (string-ascii 128))

;; private functions

;; Registering the domain
(define-private (register-domain (owner principal) (name (string-ascii 128)))
    (begin
      (unwrap! (nft-mint? AMORTIZE-DOMAIN name owner) false)
    )
)

;; Check Owner
(define-private (is-owner (name (string-ascii 128)))
  (is-eq tx-sender
    (unwrap! (nft-get-owner? AMORTIZE-DOMAIN name) false)
  )
)



;; public functions

;; minting the domain as nft on blockchain
(define-public (mint 
    (owner principal)
    (name (string-ascii 128))
    (data (buff 512))
    )
 
    (begin
        
        (asserts! (register-domain owner name) ERR_MINT_FAILED)

        (map-set domain-data
            {name: name}
            {data: data}
        )

        (ok true)

    )
)

(define-public (transfer-ownership (new-owner principal) (name (string-ascii 128)))
  (begin
    (asserts! (is-owner name) ERR_AUTH_FAILED)
    (nft-transfer? AMORTIZE-DOMAIN name tx-sender new-owner)
  )
)

;; burning the domain
(define-public (burn (name (string-ascii 128)))
  (begin
    (asserts! (is-owner name) ERR_AUTH_FAILED)
    (nft-burn? AMORTIZE-DOMAIN name tx-sender)
  )
)

(define-read-only (is-available (name (string-ascii 128)))
  (is-none (map-get? domain-data {name: name}))
)

(define-read-only (get-data (name (string-ascii 128)))
    (begin
        (asserts! (is-owner name) ERR_AUTH_FAILED)
        (ok (get data (unwrap-panic (map-get? domain-data {name: name}))))
    )
)

