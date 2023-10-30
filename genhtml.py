# Generates the final html file from the individual files - very simple script
tpl = open("index.tpl.html",'r')
out = open("index.html", 'w')
while True:
    ln = tpl.readline()
    if not ln:
        break
    found = ln.find("/*@@@ ")
    if found > -1:
        fndend = ln.find(" */", found+6)
        if fndend == -1:
            continue
        fn = ln[found+6:fndend]
        incf = open(fn, 'r')
        while True:
            iln = incf.readline()
            if not iln:
                break
            out.write(' '*found + iln)
        incf.close()
    else:
        out.write(ln)
out.close()
tpl.close()