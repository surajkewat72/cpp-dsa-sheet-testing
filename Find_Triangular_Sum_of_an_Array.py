class Solution:
    def triangularSum(self, nums: List[int]) -> int:
        n = len(nums)
        total = 0
        for i, val in enumerate(nums):
            total += val * comb(n-1, i)
        return total % 10
