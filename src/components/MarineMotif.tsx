export function OysterDrawing({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 360 360" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="pearl" cx="0" cy="0" r="1" gradientTransform="translate(190 190) rotate(90) scale(48)">
          <stop stopColor="#F4FFFC" />
          <stop offset="0.42" stopColor="#ADEFED" stopOpacity="0.92" />
          <stop offset="1" stopColor="#4B9CA2" stopOpacity="0.08" />
        </radialGradient>
        <linearGradient id="shellLine" x1="70" y1="70" x2="286" y2="300" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D3FFFE" stopOpacity="0.8" />
          <stop offset="1" stopColor="#2A827E" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <g stroke="url(#shellLine)" strokeWidth="1.15">
        <path d="M181 314C125 305 75 264 58 211C37 145 76 75 142 52C206 29 278 63 301 127C324 190 296 263 238 295C220 305 201 311 181 314Z" />
        <path d="M181 296C132 286 91 251 76 204C58 148 89 91 143 70C197 49 257 77 280 130C302 182 279 242 232 272C216 283 199 291 181 296Z" />
        <path d="M181 314C175 260 164 205 142 52M181 314C194 254 209 175 213 48M181 314C221 264 257 199 278 91M181 314C143 264 108 198 82 103M181 314C159 253 145 178 142 52M181 314C203 255 231 190 301 127M181 314C124 277 83 241 58 211" />
        <path d="M72 157C117 176 153 182 191 177C232 172 267 153 296 125M63 198C108 213 146 216 185 208C230 199 267 177 304 145M80 244C124 250 163 244 202 226C239 209 269 186 297 158" strokeOpacity="0.46" />
      </g>
      <circle cx="190" cy="190" r="49" fill="url(#pearl)" opacity="0.2" />
      <circle cx="190" cy="190" r="25" fill="url(#pearl)" />
      <circle cx="183" cy="182" r="6" fill="#F4FFFC" fillOpacity="0.66" />
      <path d="M28 112C73 92 102 91 132 96M236 300C274 298 305 283 334 255M21 262C55 280 83 285 111 282" stroke="#ADEFED" strokeOpacity="0.3" strokeLinecap="round" />
    </svg>
  )
}


export function SpecimenPair() {
  return (
    <div className="specimen-pair" aria-hidden="true">
      <div className="specimen-currents">
        <i /><i /><i /><i /><i />
      </div>
      <div className="specimen specimen--oyster">
        <OysterDrawing />
        <span>УСТРИЦА<small>форма раковины · эскиз</small></span>
      </div>
      <div className="specimen specimen--mussel">
        <svg viewBox="0 0 260 340" fill="none">
          <g stroke="currentColor" strokeWidth="1.2">
            <path d="M46 282C20 234 32 145 78 82C112 36 167 15 207 34C238 49 239 96 222 143C198 209 132 278 73 292C61 295 52 291 46 282Z" />
            <path d="M58 270C42 226 55 155 91 101C119 60 163 38 197 48C220 57 220 94 205 134C183 191 129 249 78 269C69 273 63 274 58 270Z" opacity=".72" />
            <path d="M47 282C79 228 121 151 207 34M47 282C93 234 146 165 225 66M47 282C104 247 162 189 225 109M47 282C118 259 172 216 207 163" opacity=".62" />
            <path d="M55 239C101 242 156 215 194 174M48 208C98 217 160 188 211 135M52 171C103 187 164 157 221 102M65 132C111 149 165 123 218 76M84 94C121 108 165 88 202 50" opacity=".36" />
            <path d="M42 284C26 292 20 307 22 323M49 288C37 305 37 317 43 331M55 290C50 307 53 320 61 329" strokeLinecap="round" opacity=".55" />
          </g>
          <path d="M111 201C139 172 165 139 185 101" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity=".08" />
        </svg>
        <span>МИДИЯ<small>форма раковины · эскиз</small></span>
      </div>
      <svg className="specimen-flow" viewBox="0 0 800 120" preserveAspectRatio="none">
        <path d="M0 72C148 10 240 116 390 57C534 1 646 100 800 33" />
        <path d="M0 97C153 43 258 129 417 83C558 42 672 117 800 70" />
      </svg>
    </div>
  )
}
