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
        const re = /([&\s\d]+)\s*-->\s*(?=([&\s\d]+))/g;
        while ( (res = re.exec(code)) !== null ) {
            //console.log(`${res[1]} => ${res[2]}`);
            const items1 = res[1].split(/\s+&\s+/);
            const items2 = res[2].split(/\s+&\s+/);

            for (const item1 of items1)
                for (const item2 of items2)
                    this.data[item1-1][item2-1] = true;
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
        for (let i=0; i<this.size; i++) res.data[i][i] = true;
        return res;
    }

    eq(mx) {
        if (this.size !== mx.size) return false;
        for (let i =0; i<this.size; i++)
            for(let j=0; j<this.size; j++)
                if (this.data[i][j] !== mx.data[i][j]) return false;
        return true;
    }

    simplify() {
        const opt = this.clone();
        const r = opt.reach();
        for (let i=0; i<opt.size; i++) {
            for (let j=0; j<opt.size; j++) {
                if (opt.data[i][j]) {
                    opt.data[i][j] = false;
                    if (! r.eq(opt.reach())) opt.data[i][j] = true;
                }
            }
        }
        return opt;
    }

    hr() {
        const md = this.reach();
        const N = md.size;
        const tab = {};
        const levels = [];
        
        for (let i=1; i<=N; i++) {
            let next = new Set([]);
            let prev = new Set([]);
            for (let j=0; j<N; j++) {
                if (md.data[i-1][j]) next.add(j+1);
            }

            for (let j=0; j<N; j++) {
                if (md.data[j][i-1]) prev.add(j+1);
            }

            tab[i] = {next, prev, common: next.inter(prev) };
        }

        while (true) {
            let curr = new Set([]);
            for (const i in tab) {
                if (tab[i]['prev'].eq(tab[i]['common'])) curr = curr.union(tab[i]['prev']);
            }

            for (const i in tab) {
                tab[i].prev.minus(curr);
                tab[i].next.minus(curr);
                tab[i].common.minus(curr);
            }
            levels.push(curr.arr());
            for(const d of curr.arr()) delete tab[d];
            if (Object.keys(tab).length === 0) break;
        }

        return levels;
    }


}

function code_levels(levels) {
    let code = '';
    for(let i=0; i<levels.length; i++) {
        const curr = levels[i];
        code += `\nsubgraph L${i+1}\n${curr.join(' & ')}\nend\n`;
    }
    return code;
}

class Set {
    constructor (arr) {
        this.data = {};
        if (typeof arr === 'object') {
            for(const item of arr) {
                this.data[item] = true;
            }
        } else {
            this.data[arr] = true;
        }
    }

    add(item) {
        this.data[item] = true;
    }

    arr() {
        return Object.keys(this.data);
    }

    include(item) {
        return this.data[item];
    }

    subs(set) {
        for(const item in set.data) {
            if (! this.data[item]) return false;
        }
        return true;
    }

    eq(set) {
        return this.subs(set) && set.subs(this);
    }

    minus(set) {
        for (const item in set.data) delete this.data[item];
    }

    inter(set) {
        const res = new Set([]);
        for (const item in this.data) {
            if (set.data[item]) res.add(item);
        }
        return res;
    }

    union(set) {
        return new Set([...this.arr(), ...set.arr()]);
    }

}
