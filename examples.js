const example1 = `
1-->3;1-->4;1-->7;1-->9;
2-->1;2-->3;2-->4;2-->7;2-->10;
3-->6;3-->7;
4-->6;
5-->1;5-->7;5-->8;5-->10;
6-->9;
7-->4;7-->9;
8-->7;8-->9;
10-->3;10-->4;`;

const example2 = `
1-->2;
1-->3;
1-->5;
1-->6;
1-->8;
1-->9;

2-->3;
3-->7;3-->8;3-->9;
4-->1;4-->6; 4-->8;
6-->5;
7-->9;
8-->9;
`;

const example3 = `
1-->2;
1-.->3;
1-.->5;
1-->6;
1-.->8;
1-.->9;

2-->3;
3-->7;3-->8;3-.->9;
4-->1;4-.->6; 4-.->8;
6-->5;
7-.->9;
8-.->9;
`;