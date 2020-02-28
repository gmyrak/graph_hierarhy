function get_matrix(mm_text) {
    mm_text.match()
    
}


class BinMatrix {

    constructor(code) {


        this.size  = code.match(/\d+/g).reduce((M, curr)=> +curr>+M ? curr: M , -1);
        this.data = [];
        for (let i=0; i<this.size; i++) {
            this.data[i] = [];
            for (let j=0; j<this.size; j++) {
                this.data[i][j] = false;
            }
        }

        let res;
        const re = /(\d+)\s*-->\s*(?=(\d+))/g;
        while ( (res = re.exec(code)) !== null ) {
            this.data[res[1]-1][res[2]-1] = true;
        }
    }


    toString() {
        return this.data.map(r => r.map(s => s ? 1:0).join(' ')).join("<br>");
    }

    toTable() {
        let table = '<table>';
        table += '<tr><td></td>';
        for (let i=1; i<= this.size; i++) {
            table += `<td><b>${i}<b></td>`;
        }
        table += '</tr>';

        let rn = 0;

        for(const row of this.data) {
            rn ++;
            table += `<tr><td><b>${rn}</b></td>`;
            for(const item of row) {
               table += ('<td>' + (item ? 1:0) + '</td>' );
            }
            table += '</tr>';
        }
        table += '</table>';
        return table;
    }

    toCode() {
        let code = '';
        for (let i=1; i<=this.size; i++) {
            for (let j=1; j<=this.size; j++) {
                if (this.data[i-1][j-1]) code += `${i}-->${j};\n`;
            }
        }
        return code;
    }

    clone() {
        const res = new BinMatrix(this.size);
        for (let i=0; i<this.size; i++) {
            for (let j=0; j<this.size; j++) {
                res.data[i][j] = this.data[i][j];
            }
        }
        return res;
    }

    plus(m2) {
        if (this.size !== m2.size) throw "Size doesn't match";
        const res = new BinMatrix(this.size);
        for (let i=0; i<this.size; i++) {
            for (let j=0; j<this.size; j++) {
                res.data[i][j] = this.data[i][j] || m2.data[i][j];
            }
        }
        return res;
    }

    mult(m2) {
        if (this.size !== m2.size) throw "Size doesn't match";
        const res = new BinMatrix(this.size);
        for (let i=0; i<this.size; i++) {
            for (let j=0; j<this.size; j++) {
                for (let k=0; k<this.size; k++) {
                    res.data[i][j] = (res.data[i][j] || (this.data[i][k] && m2.data[k][j]));
                }
            }
        }
        return res;
    }

    reach() {
        let res = this.clone();
        let exp = this.clone();
        for (let n =1; n < this.size; n++) {
            res = res.plus(exp);
            exp = exp.mult(this);
        }
        return res;
    }




}