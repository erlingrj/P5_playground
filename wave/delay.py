
t = [1,2,3,4,5,6,7,8,9]
r = [8,9,12,12,15,15,15,16]
d = []
d.append(r[0]-t[0])
u = 0.2

for i in range(1,8):
    d.append((1-u)*d[i-1] + u*(r[i]-t[i]))
print(d)

print(len(t))
